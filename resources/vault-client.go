package resources

import (
	vault "github.com/hashicorp/vault/api"
)

// VaultClient is the wrapper that allows other parts of the code
// to access vault and get nomad tokens
type VaultClient struct {
	client *vault.Client
}

// NewVaultClient constructor that produces a valid
func NewVaultClient(addr string) (*VaultClient, error) {
	v := vault.DefaultConfig()
	v.Address = addr
	v.MaxRetries = 3

	client, err := vault.NewClient(v)
	if err != nil {
		return nil, err
	}

	return &VaultClient{
		client: client,
	}, nil
}

// GetNomadToken fetches nomad token from vault
// referenced from https://mycodesmells.com/post/accessing-vault-with-go
func (vc VaultClient) GetNomadToken(path string) (string, error) {
	secret, err := vc.client.Logical().Read(path)

	if err != nil {
		return "", err
	}
	return secret.Data["secret_id"].(string), nil
}

// GetVaultToken fetches vault token
func (vc VaultClient) GetVaultToken() string {
	return vc.client.Token()
}
