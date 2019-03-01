package resources

import (
	"fmt"
	"net/http"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/endpoints"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/autoscaling"
)

// EC2AutoScalingGroup allows user to interface with AWS SDK and scale
// EC2 clusters
type EC2AutoScalingGroup struct {
	awsScalingProvider *autoscaling.AutoScaling
	scalingGrpName     string
	region             string
	maxscale           int
	minscale           int
}

// NewEC2AutoScalingGroup factory function
func NewEC2AutoScalingGroup(region string, gpName string, maxscale int, minscale int) *EC2AutoScalingGroup {
	return &EC2AutoScalingGroup{
		awsScalingProvider: newAwsAsgService(region),
		scalingGrpName:     gpName,
		region:             region,
		maxscale:           maxscale,
		minscale:           minscale,
	}
}

// newAwsAsgService returns a session object for the AWS autoscaling service.
func newAwsAsgService(region string) (Session *autoscaling.AutoScaling) {
	sess := session.Must(session.NewSession())
	svc := autoscaling.New(sess, config())
	return svc
}

// Config produces a generic set of AWS configs
func config() *aws.Config {
	return aws.NewConfig().
		WithCredentials(credentials.NewStaticCredentials("", "", "")).
		WithRegion("ap-southeast-1").
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
	sess := newAwsAsgService("ap-southeast-1")
	asg, _ := describeScalingGroup("spark-nomad-client", sess)

	desiredCap := *asg.AutoScalingGroups[0].DesiredCapacity
	fmt.Println(desiredCap)

	param := &autoscaling.UpdateAutoScalingGroupInput{
		AutoScalingGroupName: aws.String("spark-nomad-client"),
		DesiredCapacity:      aws.Int64(25),
	}
	_, err := sess.UpdateAutoScalingGroup(param)

	if err != nil {
		fmt.Println(err)
	}

	asg2, _ := describeScalingGroup("spark-nomad-client", sess)
	fmt.Println(*asg2.AutoScalingGroups[0].DesiredCapacity)
	return nil
}
