package app

import (
	"database/sql/driver"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/jmoiron/sqlx"
)

type AnyTime struct{}

// Match satisfies sqlmock.Argument interface
func (a AnyTime) Match(v driver.Value) bool {
	_, ok := v.(time.Time)
	return ok
}

// a successful case
func TestShouldUpdateStats(t *testing.T) {
	test := "Test statement 1"
	test2 := "Test statement 2"
	testrows := sqlmock.NewRows([]string{"state"}).AddRow(test)
	test2rows := sqlmock.NewRows([]string{"state"}).AddRow(test2)

	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()
	mock.ExpectBegin()
	mock.ExpectExec("CREATE TABLE").WillReturnResult(sqlmock.NewResult(1, 0))
	mock.ExpectExec("INSERT INTO autoscaler").WithArgs(AnyTime{}, test).WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectQuery("SELECT state FROM autoscaler WHERE timestamp = \\(SELECT MAX\\(timestamp\\) FROM autoscaler\\)").WillReturnRows(testrows)
	mock.ExpectExec("INSERT INTO autoscaler").WithArgs(AnyTime{}, test2).WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectQuery("SELECT state FROM autoscaler WHERE timestamp = \\(SELECT MAX\\(timestamp\\) FROM autoscaler\\)").WillReturnRows(test2rows)

	st := Store{
		db: sqlx.NewDb(db, "postgres"),
	}

	st.db.Begin()
	st.db.Exec(CreateTablesSQL)
	st.SaveState(test)
	out, err := st.GetLatestState()
	if err != nil {
		t.Errorf(err.Error())
	}

	if out != test {
		t.Error("store did not read most recently inserted state")
	}

	// insert another and read
	st.SaveState(test2)
	out2, err := st.GetLatestState()
	if err != nil {
		t.Errorf(err.Error())
	}

	if out2 != test2 {
		t.Error("store did not read most recently inserted state")
	}

	// we make sure that all expectations were met
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}
