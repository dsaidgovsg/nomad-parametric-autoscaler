package resources

import (
	"os"
	"testing"
)

func TestVaultClientCreation(t *testing.T) {
	vc, err := NewVaultClient("vault-test")

	if os.Getenv("VAULT_TOKEN") != "" {
		t.Errorf("Expected VAULT_TOKEN envvar to be missing. Invalid test condition.")
	}

	if err != nil {
		t.Errorf("Expected vault client to still be created despite invalid address")
	}

	if vc.GetVaultToken() != "" {
		t.Errorf("Expected vault token to be empty string if VAULT_TOKEN envvar is missing")
	}

	if _, err := vc.GetNomadToken(""); err == nil {
		t.Errorf("Expected nomad token fetching to be invalid if vault token is misssing")
	}
}
