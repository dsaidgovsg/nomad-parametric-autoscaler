package resources

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
)

// UpdateBody is used to marshal the job into a json for updating
type UpdateBody struct {
	Job            map[string]interface{} `json:"Job"`
	EnforceIndex   bool                   `json:"EnforceIndex"`
	JobModifyIndex int                    `json:"JobModifyIndex"`
}

// NomadClient contains details to access our nomad client
type NomadClient struct {
	jobName       string
	clientAddress string
	maxCount      int
	minCount      int
}

// NewNomadClient is a factory that produces a new NewNomadClient
func NewNomadClient(addr string, name string, minCount int, maxCount int) *NomadClient {
	return &NomadClient{
		clientAddress: addr,
		jobName:       name,
		maxCount:      maxCount,
		minCount:      minCount,
	}
}

// GetTaskGroupCount retrieves the jobspec to check task group count
func (nc NomadClient) GetTaskGroupCount() (int, error) {
	body, err := nc.getNomadJob()

	if err != nil {
		return 0, err // unable to get nomad job
	}

	var result map[string]interface{}
	json.Unmarshal([]byte(body), &result)

	if tg := result["TaskGroups"]; tg != nil {
		tgItf := tg.([]interface{})
		if count := tgItf[0].(map[string]interface{})["Count"]; count != nil {
			return int(count.(float64)), nil
		} else {
			return 0, errors.New("Invalid Key: Count in Nomad Job")
		}
	} else {
		return 0, errors.New("Invalid Key: TaskGroups in Nomad Job")
	}
}

// Scale get json -> find number -> change number, add vault token -> convert to json
func (nc NomadClient) Scale(newCount int) error {
	body, err := nc.getNomadJob()
	if err != nil {
		return err
	}

	var result map[string]interface{}
	json.Unmarshal([]byte(body), &result)

	// extract jmi
	modIdx := result["JobModifyIndex"].(float64)
	result["JobModifyIndex"] = int(modIdx)

	// set vault token
	result["VaultToken"] = "1" // get from envvar

	// set new count
	nc.setTaskGroupCount(result, newCount)

	ub := UpdateBody{
		Job:            result,
		EnforceIndex:   true,
		JobModifyIndex: int(modIdx),
	}

	out, err := json.Marshal(ub)

	if err != nil {
		return err
	}

	fmt.Println(out)
	req, err := http.NewRequest("POST", "url", bytes.NewBuffer(out))
	req.Header.Set("X-Custom-Header", "myvalue")
	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{}
	resp, err := client.Do(req)

	if err != nil {
		return err
	}

	defer resp.Body.Close()

	fmt.Println("response Status:", resp.Status)
	fmt.Println("response Headers:", resp.Header)
	return nil
}

// getNomadJob - private method that fetches the nomad jobspec for this resource
func (nc NomadClient) getNomadJob() ([]byte, error) {
	var b bytes.Buffer
	b.WriteString(nc.clientAddress)
	b.WriteString(nc.jobName)
	resp, err := http.Get(b.String())

	if err != nil {
		fmt.Println(err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	return body, err
}

// setTaskGroupCount modifies existing TaskGroups.Count in the jobspec-map
func (nc *NomadClient) setTaskGroupCount(result map[string]interface{}, newCount int) error {
	if tg := result["TaskGroups"]; tg != nil {
		tgItf := tg.([]interface{})
		if count := tgItf[0].(map[string]interface{})["Count"]; count != nil {
			tgItf[0].(map[string]interface{})["Count"] = newCount
			return nil
		} else {
			return errors.New("Invalid Key: Count in Nomad Job")
		}
	} else {
		return errors.New("Invalid Key: TaskGroups in Nomad Job")
	}
}

// Testnomad - test fn
func Testnomad() {
	t := NewNomadClient("https://nomad.locus.rocks/v1/job/", "spark-worker", 25, 10)
	fmt.Println(t.GetTaskGroupCount())
}
