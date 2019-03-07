module github.com/datagovsg/nomad-parametric-autoscaler

require (
	contrib.go.opencensus.io/exporter/stackdriver v0.9.1 // indirect
	github.com/NYTimes/gziphandler v1.1.1 // indirect
	github.com/RackSec/srslog v0.0.0-20180709174129-a4725f04ec91 // indirect
	github.com/SAP/go-hdb v0.13.2 // indirect
	github.com/Sirupsen/logrus v1.0.6
	github.com/aliyun/alibaba-cloud-sdk-go v0.0.0-20190304073328-99e6c8e7bb79 // indirect
	github.com/aws/aws-sdk-go v1.17.7
	github.com/boombuler/barcode v1.0.0 // indirect
	github.com/briankassouf/jose v0.9.1 // indirect
	github.com/burntsushi/toml v0.3.1 // indirect
	github.com/cenkalti/backoff v2.1.1+incompatible // indirect
	github.com/centrify/cloud-golang-sdk v0.0.0-20190214225812-119110094d0f // indirect
	github.com/chrismalek/oktasdk-go v0.0.0-20181212195951-3430665dfaa0 // indirect
	github.com/circonus-labs/circonus-gometrics v2.2.6+incompatible // indirect
	github.com/coredns/coredns v1.4.0 // indirect
	github.com/coreos/go-oidc v2.0.0+incompatible // indirect
	github.com/coreos/go-semver v0.2.0 // indirect
	github.com/denisenkom/go-mssqldb v0.0.0-20190204142019-df6d76eb9289 // indirect
	github.com/dimchansky/utfbom v1.1.0 // indirect
	github.com/docker/distribution v2.7.1+incompatible // indirect
	github.com/docker/docker v1.13.1 // indirect
	github.com/docker/go-metrics v0.0.0-20181218153428-b84716841b82 // indirect
	github.com/duosecurity/duo_api_golang v0.0.0-20190107154727-539434bf0d45 // indirect
	github.com/envoyproxy/go-control-plane v0.6.8 // indirect
	github.com/fsouza/go-dockerclient v1.3.6 // indirect
	github.com/fullsailor/pkcs7 v0.0.0-20180613152042-8306686428a5 // indirect
	github.com/gammazero/deque v0.0.0-20190130191400-2afb3858e9c7 // indirect
	github.com/gammazero/workerpool v0.0.0-20181230203049-86a96b5d5d92 // indirect
	github.com/gin-contrib/sse v0.0.0-20190226023149-996076df5b33 // indirect
	github.com/gin-gonic/gin v1.3.0
	github.com/go-errors/errors v1.0.1 // indirect
	github.com/go-ldap/ldap v3.0.2+incompatible // indirect
	github.com/go-sql-driver/mysql v1.4.1 // indirect
	github.com/gocql/gocql v0.0.0-20190301043612-f6df8288f9b4 // indirect
	github.com/gogo/googleapis v1.1.0 // indirect
	github.com/golang/protobuf v1.3.0 // indirect
	github.com/golang/snappy v0.0.1 // indirect
	github.com/googleapis/gax-go v2.0.2+incompatible // indirect
	github.com/gorhill/cronexpr v0.0.0-20180427100037-88b0669f7d75 // indirect
	github.com/hashicorp/consul v1.4.2 // indirect
	github.com/hashicorp/consul-template v0.20.0 // indirect
	github.com/hashicorp/go-checkpoint v0.5.0 // indirect
	github.com/hashicorp/go-discover v0.0.0-20190226150400-504b36597c3c // indirect
	github.com/hashicorp/go-envparse v0.0.0-20180119215841-310ca1881b22 // indirect
	github.com/hashicorp/go-gcp-common v0.0.0-20180425173946-763e39302965 // indirect
	github.com/hashicorp/go-getter v1.1.0 // indirect
	github.com/hashicorp/go-plugin v0.0.0-20190220160451-3f118e8ee104 // indirect
	github.com/hashicorp/go-retryablehttp v0.5.2 // indirect
	github.com/hashicorp/go-rootcerts v1.0.0 // indirect
	github.com/hashicorp/golang-lru v0.5.1 // indirect
	github.com/hashicorp/hil v0.0.0-20190212132231-97b3a9cdfa93 // indirect
	github.com/hashicorp/net-rpc-msgpackrpc v0.0.0-20151116020338-a14192a58a69 // indirect
	github.com/hashicorp/nomad v0.9.0-beta3.0.20190228221024-82d37b99dff9
	github.com/hashicorp/raft-boltdb v0.0.0-20171010151810-6e5ba93211ea // indirect
	github.com/hashicorp/serf v0.8.2 // indirect
	github.com/hashicorp/vault v1.0.3
	github.com/hashicorp/vault-plugin-auth-alicloud v0.0.0-20181109180636-f278a59ca3e8 // indirect
	github.com/hashicorp/vault-plugin-auth-azure v0.0.0-20190201222632-0af1d040b5b3 // indirect
	github.com/hashicorp/vault-plugin-auth-centrify v0.0.0-20180816201131-66b0a34a58bf // indirect
	github.com/hashicorp/vault-plugin-auth-gcp v0.0.0-20190201215414-7d4c2101e7d0 // indirect
	github.com/hashicorp/vault-plugin-auth-jwt v0.0.0-20190301004126-6f35dea7f720 // indirect
	github.com/hashicorp/vault-plugin-auth-kubernetes v0.0.0-20190201222209-db96aa4ab438 // indirect
	github.com/hashicorp/vault-plugin-secrets-ad v0.0.0-20190131222416-4796d9980125 // indirect
	github.com/hashicorp/vault-plugin-secrets-alicloud v0.0.0-20190131211812-b0abe36195cb // indirect
	github.com/hashicorp/vault-plugin-secrets-azure v0.0.0-20181207232500-0087bdef705a // indirect
	github.com/hashicorp/vault-plugin-secrets-gcp v0.0.0-20180921173200-d6445459e80c // indirect
	github.com/hashicorp/vault-plugin-secrets-gcpkms v0.0.0-20190116164938-d6b25b0b4a39 // indirect
	github.com/hashicorp/vault-plugin-secrets-kv v0.0.0-20190227052836-76a82948fe5b // indirect
	github.com/influxdata/influxdb v1.7.4 // indirect
	github.com/influxdata/platform v0.0.0-20190117200541-d500d3cf5589 // indirect
	github.com/jeffchao/backoff v0.0.0-20140404060208-9d7fd7aa17f2 // indirect
	github.com/jefferai/jsonx v1.0.0 // indirect
	github.com/kardianos/osext v0.0.0-20190222173326-2bc1f35cddc0 // indirect
	github.com/keybase/go-crypto v0.0.0-20181127160227-255a5089e85a // indirect
	github.com/lyft/protoc-gen-validate v0.0.13 // indirect
	github.com/mattn/go-shellwords v1.0.5 // indirect
	github.com/michaelklishin/rabbit-hole v1.5.0 // indirect
	github.com/mitchellh/colorstring v0.0.0-20190213212951-d06e56a500db // indirect
	github.com/mitchellh/go-ps v0.0.0-20170309133038-4fdf99ab2936 // indirect
	github.com/mitchellh/hashstructure v1.0.0 // indirect
	github.com/mitchellh/pointerstructure v0.0.0-20170205204203-f2329fcfa9e2 // indirect
	github.com/moby/moby v1.13.1 // indirect
	github.com/opencontainers/runtime-spec v1.0.1 // indirect
	github.com/ory/dockertest v3.3.4+incompatible // indirect
	github.com/pquerna/cachecontrol v0.0.0-20180517163645-1555304b9b35 // indirect
	github.com/pquerna/otp v1.1.0 // indirect
	github.com/rs/cors v1.6.0 // indirect
	github.com/ryanuber/go-glob v1.0.0 // indirect
	github.com/shirou/gopsutil v2.18.12+incompatible // indirect
	github.com/skratchdot/open-golang v0.0.0-20190104022628-a2dfa6d0dab6 // indirect
	github.com/syndtr/gocapability v0.0.0-20180916011248-d98352740cb2 // indirect
	github.com/ugorji/go/codec v0.0.0-20190204201341-e444a5086c43 // indirect
	github.com/vbatts/tar-split v0.11.1 // indirect
	go.opencensus.io v0.19.1 // indirect
	golang.org/x/net v0.0.0-20190227160552-c95aed5357e7 // indirect
	golang.org/x/time v0.0.0-20181108054448-85acf8d2951c // indirect
	gopkg.in/asn1-ber.v1 v1.0.0-20181015200546-f715ec2f112d // indirect
	gopkg.in/go-playground/validator.v8 v8.18.2 // indirect
	gopkg.in/square/go-jose.v2 v2.3.0 // indirect
	gopkg.in/tomb.v2 v2.0.0-20161208151619-d5d1b5820637 // indirect
	layeh.com/radius v0.0.0-20190118135028-0f678f039617 // indirect
	rsc.io/quote v1.5.2
)
