package app

import (
	"fmt"
	"os"
	"time"

	"github.com/datagovsg/nomad-parametric-autoscaler/logging"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

// Store records new state updates to a persistent store
// table schema : time | state (string)
type Store struct {
	db *sqlx.DB
}

var CreateTablesSQL = `
CREATE TABLE autoscaler (
    timestamp TIMESTAMP,
    state text
);
`

// or this? postgres://username:password@localhost/db_name?sslmode=disable
const (
	dbhost = "POSTGRES_HOST"
	dbport = "POSTGRES_PORT"
	dbuser = "POSTGRES_USER"
	dbpass = "POSTGRES_PASSWORD"
	dbname = "POSTGRES_DB"
)

func dbConfig() map[string]string {
	conf := make(map[string]string)
	host, ok := os.LookupEnv(dbhost)
	if !ok {
		panic("DBHOST environment variable required but not set")
	}
	port, ok := os.LookupEnv(dbport)
	if !ok {
		panic("DBPORT environment variable required but not set")
	}
	user, ok := os.LookupEnv(dbuser)
	if !ok {
		panic("DBUSER environment variable required but not set")
	}
	password, ok := os.LookupEnv(dbpass)
	if !ok {
		panic("DBPASS environment variable required but not set")
	}
	name, ok := os.LookupEnv(dbname)
	if !ok {
		panic("DBNAME environment variable required but not set")
	}
	conf[dbhost] = host
	conf[dbport] = port
	conf[dbuser] = user
	conf[dbpass] = password
	conf[dbname] = name
	return conf
}

// Initialise creates the connection to sqlx.DB
func (st *Store) Initialise() error {
	config := dbConfig()
	var err error
	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s "+
		"password=%s dbname=%s sslmode=disable",
		config[dbhost], config[dbport],
		config[dbuser], config[dbpass], config[dbname])

	if st.db, err = sqlx.Open("postgres", psqlInfo); err != nil {
		return err
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
	return state[0], nil
}

func (st *Store) createTables() error {
	_, err := st.db.Exec(CreateTablesSQL)
	return err
}
