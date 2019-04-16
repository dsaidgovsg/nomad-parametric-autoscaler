package app

import (
	"fmt"
	"math"
	"os"
	"time"

	"github.com/datagovsg/nomad-parametric-autoscaler/logging"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

// Store records new state updates to a persistent store
// table schema : timestamp (TIMESTAMP) | state (text)
type Store struct {
	db *sqlx.DB
}

// CreateTablesSQL contains statement for table if doesnt exist
const CreateTablesSQL = `
CREATE TABLE autoscaler (
    timestamp TIMESTAMP,
    state text
);
`
const (
	dbhost = "POSTGRES_HOST"
	dbport = "POSTGRES_PORT"
	dbuser = "POSTGRES_USER"
	dbpass = "POSTGRES_PASSWORD"
	dbname = "POSTGRES_DB"
)

func dbConfig() (map[string]string, error) {
	conf := make(map[string]string)
	host, ok := os.LookupEnv(dbhost)
	if !ok {
		return nil, fmt.Errorf("POSTGRES_HOST environment variable required but not set")
	}
	port, ok := os.LookupEnv(dbport)
	if !ok {
		return nil, fmt.Errorf("POSTGRES_PORT environment variable required but not set")
	}
	user, ok := os.LookupEnv(dbuser)
	if !ok {
		return nil, fmt.Errorf("POSTGRES_USER environment variable required but not set")
	}
	password, ok := os.LookupEnv(dbpass)
	if !ok {
		return nil, fmt.Errorf("POSTGRES_PASSWORD environment variable required but not set")
	}
	name, ok := os.LookupEnv(dbname)
	if !ok {
		return nil, fmt.Errorf("POSTGRES_DB environment variable required but not set")
	}
	conf[dbhost] = host
	conf[dbport] = port
	conf[dbuser] = user
	conf[dbpass] = password
	conf[dbname] = name
	return conf, nil
}

// Initialise creates the connection to sqlx.DB and creates an empty table if none exists
func (st *Store) Initialise() error {
	var err error
	config, err := dbConfig()

	if err != nil {
		return err
	}

	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s "+
		"password=%s dbname=%s sslmode=disable",
		config[dbhost], config[dbport],
		config[dbuser], config[dbpass], config[dbname])

	logging.Info("opening connection to sql database")
	if st.db, err = sqlx.Open("postgres", psqlInfo); err != nil {
		return err
	}

	// Since this happens at initialization we
	// could encounter racy conditions waiting for pg
	// to become available. Wait for it a bit
	if err = st.db.Ping(); err != nil {
		// Try 3 more times
		// 5, 10, 20
		for i := 0; i < 3 && err != nil; i++ {
			time.Sleep(time.Duration(5*math.Pow(2, float64(i))) * time.Second)
			err = st.db.Ping()
		}
		if err != nil {
			return err
		}
	}

	// check if table exist else create it
	if err := st.createTables(); err != nil {
		logging.Warning(err.Error())
	}

	return nil
}

// SaveState stores the state in compacted string form to the psql db
func (st Store) SaveState(state string) error {
	submitTime := time.Now()
	if _, err := st.db.Exec("INSERT INTO autoscaler(timestamp, state) VALUES ($1, $2)", submitTime, state); err != nil {
		return err
	}
	return nil
}

// GetLatestState reads the state column of the row with latest timestamp
func (st Store) GetLatestState() (string, error) {
	readStatement := "SELECT state FROM autoscaler WHERE timestamp = (SELECT MAX(timestamp) FROM autoscaler);"
	state, err := st.read(readStatement)

	if err != nil {
		return "", err
	}

	return state, nil
}

func (st Store) read(statement string) (string, error) {
	state := []string{}
	err := st.db.Select(&state, statement)
	if err != nil {
		return "", err
	}

	if len(state) < 1 {
		return "", fmt.Errorf("state table is empty, using default state")
	}

	return state[0], nil
}

func (st *Store) createTables() error {
	logging.Info("create table if does not exist")
	_, err := st.db.Exec(CreateTablesSQL)
	return err
}
