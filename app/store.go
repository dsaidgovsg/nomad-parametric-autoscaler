package app

import (
	"time"

	"github.com/datagovsg/nomad-parametric-autoscaler/logging"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

// or this? postgres://username:password@localhost/db_name?sslmode=disable
const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "docker"
	dbname   = "autoscaler"
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

// Initialise creates the connection to sqlx.DB
func (st *Store) Initialise() error {
	var err error
	connStr := "user=postgres password=docker dbname=postgres sslmode=disable"
	if st.db, err = sqlx.Open("postgres", connStr); err != nil {
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
