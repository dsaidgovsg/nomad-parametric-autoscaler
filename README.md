# nomad-parametric-autoscaler


## Overview
A service that scales spark-worker cluster
* Parametric: policy is parameter-dependent -> can be changed dynamically via HTTP calls
* Auto: given a policy, its self-correcting
* Scaler: scales nomad + EC2 instances

## API Endpoints
* PUT update_policy
* PUT reset
* GET current_policy => gets current policy `struct` in JSON format

## Policy
Possible factors to consider for scaling
* **Spark core ratio: (cores used) / (total cores)**
* QOD redis queue length
* Number of Active Users

**note: bold ones are confirmed already

### Policy structure

A policy will govern how the scaling service manage the resources assigned to it.

```
Policy:
1. resource list (resources to scale)
2. constraints
3. sub-policy
4. ensembling method
5. perform scaling
```

### Subpolicy
Each sub-policy will 
1. track metric
2. recommend count for resources that its responsible for

```go
// something like this
type SubPolicy interface {
    advisedResources() []Resource
    recommendCount()   map[Resource]int
}

type generalSubPolicy struct {
    metricSource        string
    isAdvising          bool
}
```
Sub-policy should implement `SubPolicy` interface and should internally implement relevant functions to obtain metrics from the relevant sources. Each sub-policy will have metric source (URI), some resolution method (based on response, how does it make sense of the signal). 

For example:
```go
// core-ratio policy
metric: core ratio via HTTP GET call to spark cluster
up-threshold: 0.5
down-threshold: 0.25
scaleup: {multiply, 2}
scaledown:  {multiply, 0.5}

// queue length policy
metric: queue length via HTTP GET call to router
up-threshold: 1
down-threshold: 0.5
scaleup: { multiply, }
scaledown: { multiply, 0.5 }

// active users online
metric: queue length via HTTP GET call to router
up-threshold: 1
down-threshold: 0.9
scaleup: { until, 200 }
scaledown: { until, 50 }
```

```go
type scalingMagnitude struct {
    changeType   string   // add, multiply, until
    changeValue  float64
}
```


### Ensembling sub-policy decisions
Each sub-policy will recommend a count to scale to. 

E.g. 
1. sub-policy 1(core ratio), recommended core level is 200
2. sub-policy 2 (redis queue length), recommended level is 400 (as policy 2 also scales QOD instances)
3. sub-policy 3 (active users) recommends 100 (minimum that we should have as long as 1 user is logged in). 

Various ensembling methods can be considered for each resource
1. Conservative(take maximum to be safe)
2. Averaging
3. Cost-saving(take minimum to save cost)

```go
type Ensembler interface {
	Ensemble(spd []int) int
}
```

### Constraints
* Max core: maximum resource the scaler will bring the cluster up til
* Min core: minimum resource the scaler will bring the cluster up til
* Scaling frequency: minimum time since last scaling effect
