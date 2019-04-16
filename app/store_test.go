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
	testrows := sqlmock.NewRows([]string{"state"}).AddRow("TEST")
	test2rows := sqlmock.NewRows([]string{"state"}).AddRow("TEST2")

	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("an error '%s' was not expected when opening a stub database connection", err)
	}
	defer db.Close()
	mock.ExpectBegin()
	mock.ExpectExec("CREATE TABLE").WillReturnResult(sqlmock.NewResult(1, 0))
	mock.ExpectExec("INSERT INTO autoscaler").WithArgs(AnyTime{}, "TEST").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectQuery("SELECT state FROM autoscaler").WillReturnRows(testrows)
	mock.ExpectExec("INSERT INTO autoscaler").WithArgs(AnyTime{}, "TEST2").WillReturnResult(sqlmock.NewResult(1, 1))
	mock.ExpectQuery("SELECT state FROM autoscaler").WillReturnRows(test2rows)

	st := Store{
		db: sqlx.NewDb(db, "postgres"),
	}

	st.db.Begin()
	st.db.Exec(CreateTablesSQL)
	st.SaveState("TEST")
	out, err := st.GetLatestState()
	if err != nil {
		t.Errorf(err.Error())
	}

	if out != "TEST" {
		t.Error("did not read most recently inserted state")
	}

	// insert another and read
	st.SaveState("TEST2")
	out2, err := st.GetLatestState()
	if err != nil {
		t.Errorf(err.Error())
	}

	if out2 != "TEST2" {
		t.Error("did not read most recently inserted state")
	}

	// we make sure that all expectations were met
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Errorf("there were unfulfilled expectations: %s", err)
	}
}
