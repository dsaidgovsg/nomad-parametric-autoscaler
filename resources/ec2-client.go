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
	ScalingGrpName string `json:"ScalingGrpName"`
	Region         string `json:"Region"`

	awsScalingProvider *autoscaling.AutoScaling
	maxscale           int
	minscale           int
}

// NewEC2AutoScalingGroup factory function
func NewEC2AutoScalingGroup(region string, gpName string, maxscale int, minscale int) *EC2AutoScalingGroup {
	return &EC2AutoScalingGroup{
		awsScalingProvider: newAwsAsgService(region),
		ScalingGrpName:     gpName,
		Region:             region,
		maxscale:           maxscale,
		minscale:           minscale,
	}
}

// newAwsAsgService returns a session object for the AWS autoscaling service.
func newAwsAsgService(region string) (Session *autoscaling.AutoScaling) {
	sess := session.Must(session.NewSession())
	svc := autoscaling.New(sess, config(region))
	return svc
}

// Config produces a generic set of AWS configs
func config(region string) *aws.Config {
	return aws.NewConfig().
		WithCredentials(credentials.NewStaticCredentials("", "", "")).
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
	sess := newAwsAsgService(easg.Region)
	asg, _ := describeScalingGroup(easg.ScalingGrpName, sess)

	desiredCap := *asg.AutoScalingGroups[0].DesiredCapacity
	fmt.Println(desiredCap)

	param := &autoscaling.UpdateAutoScalingGroupInput{
		AutoScalingGroupName: aws.String(easg.ScalingGrpName),
		DesiredCapacity:      aws.Int64(int64(newCount)),
	}
	_, err := sess.UpdateAutoScalingGroup(param)

	if err != nil {
		fmt.Println(err)
	}

	asg2, _ := describeScalingGroup(easg.ScalingGrpName, sess)
	fmt.Println(*asg2.AutoScalingGroups[0].DesiredCapacity)
	return nil
}
