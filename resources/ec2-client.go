package resources

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/endpoints"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/autoscaling"
	"github.com/datagovsg/nomad-parametric-autoscaler/logging"
)

// EC2AutoScalingGroup allows user to interface with AWS SDK and scale
// EC2 clusters
type EC2AutoScalingGroup struct {
	ScalingGroupName string `json:"ScalingGroupName"`
	Region           string `json:"Region"`

	awsScalingProvider *autoscaling.AutoScaling
	maxscale           int
	minscale           int
}

type EC2AutoScalingGroupPlan struct {
	ScalingGroupName string `json:"ScalingGroupName"`
	Region           string `json:"Region"`
	MaxCount         int    `json:"MaxCount"`
	MinCount         int    `json:"MinCount"`
}

func (asgp EC2AutoScalingGroupPlan) ApplyPlan() *EC2AutoScalingGroup {
	asg := NewEC2AutoScalingGroup(asgp.Region, asgp.ScalingGroupName, asgp.MaxCount, asgp.MinCount)
	return asg
}

// NewEC2AutoScalingGroup factory function
func NewEC2AutoScalingGroup(region string, gpName string, maxscale int, minscale int) *EC2AutoScalingGroup {
	return &EC2AutoScalingGroup{
		awsScalingProvider: newAwsAsgService(region),
		ScalingGroupName:   gpName,
		Region:             region,
		maxscale:           maxscale,
		minscale:           minscale,
	}
}

// newAwsAsgService returns a session object for the AWS autoscaling service.
func newAwsAsgService(region string) (Session *autoscaling.AutoScaling) {
	sess := session.Must(session.NewSession())
	svc := autoscaling.New(sess, config(region, os.Getenv("ASG_ID"), os.Getenv("ASG_SECRET")))
	return svc
}

// Config produces a generic set of AWS configs
func config(region, id, secret string) *aws.Config {
	return aws.NewConfig().
		WithCredentials(credentials.NewStaticCredentials(id, secret, "")).
		WithRegion(region).
		WithHTTPClient(http.DefaultClient).
		WithMaxRetries(aws.UseServiceDefaultRetries).
		WithLogger(aws.NewDefaultLogger()).
		WithLogLevel(aws.LogOff).
		WithSleepDelay(time.Sleep).
		WithEndpointResolver(endpoints.DefaultResolver())
}

// describeScalingGroup
func describeScalingGroup(asgName string,
	svc *autoscaling.AutoScaling) (
	asg *autoscaling.DescribeAutoScalingGroupsOutput, err error) {

	params := &autoscaling.DescribeAutoScalingGroupsInput{
		AutoScalingGroupNames: []*string{
			aws.String(asgName),
		},
	}
	resp, err := svc.DescribeAutoScalingGroups(params)

	// If we failed to get exactly one ASG, raise an error.
	if len(resp.AutoScalingGroups) != 1 {
		err = fmt.Errorf("the attempt to retrieve the current worker pool "+
			"autoscaling group configuration expected exaclty one result got %v",
			len(resp.AutoScalingGroups))
	}

	return resp, err
}

// Scale takes in the final count as prescribed by Resource and scales the ASG
func (easg EC2AutoScalingGroup) Scale(newCount int) error {
	asg, err := describeScalingGroup(easg.ScalingGroupName, easg.awsScalingProvider)

	if err != nil {
		return err
	}

	desiredCap := *asg.AutoScalingGroups[0].DesiredCapacity

	param := &autoscaling.UpdateAutoScalingGroupInput{
		AutoScalingGroupName: aws.String(easg.ScalingGroupName),
		DesiredCapacity:      aws.Int64(int64(newCount)),
	}

	logging.Info("Old EC2: %d. Desired EC2: %d", desiredCap, newCount)
	_, err = easg.awsScalingProvider.UpdateAutoScalingGroup(param)

	if err != nil {
		return err
	}

	asg2, err := describeScalingGroup(easg.ScalingGroupName, easg.awsScalingProvider)

	if err != nil {
		return err
	}

	logging.Info("Old EC2: %d. New EC2: %d", desiredCap, *asg2.AutoScalingGroups[0].DesiredCapacity)

	if *asg2.AutoScalingGroups[0].DesiredCapacity != int64(newCount) {
		return fmt.Errorf("Scaling failed to happen for EC2 auto scaling group")
	}

	return nil
}

func (easg EC2AutoScalingGroup) Check() error {
	asg, _ := describeScalingGroup(easg.ScalingGroupName, easg.awsScalingProvider)
	fmt.Println(*asg.AutoScalingGroups[0].DesiredCapacity)
	return nil
}

func (easg EC2AutoScalingGroup) RecreatePlan() EC2AutoScalingGroupPlan {
	return EC2AutoScalingGroupPlan{
		ScalingGroupName: easg.ScalingGroupName,
		Region:           easg.Region,
		MaxCount:         easg.maxscale,
		MinCount:         easg.minscale,
	}
}
