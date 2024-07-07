# AWS API Gateway Automation

Este script em Python automatiza a criação e atualização de APIs no AWS API Gateway, utilizando boto3 e seguindo um fluxo definido.

## Pré-requisitos

- Python 3.x
- Biblioteca boto3
- AWS CLI configurado com o perfil adequado

## Uso

```sh
python api_gateway_automation.py <spec_output.yaml> <CustomDomainName> <ProfileName> <TagsNameAPi> <StageVariables> <StageName> <PrivateApi> <VpcEndpoint> [--dry-run]
```

```mermaid
sequenceDiagram
    participant User
    participant Script
    participant AWSAPI as AWS API Gateway
    participant VPC as Amazon VPC Endpoint

    User ->> Script: Run script with parameters
    Script ->> Script: Read spec-output.yaml
    Script ->> Script: Get AWS client using profile
    Script ->> AWSAPI: Check if API exists (by title)
    alt API exists
        Script ->> AWSAPI: Backup API state
        Script ->> AWSAPI: Update API
    else API does not exist
        Script ->> AWSAPI: Create new API
    end
    Script ->> Script: Check if API is private
    alt Private API
        Script ->> VPC: Configure VPC endpoint and policy
    else Regional API
        Script ->> Script: No VPC configuration needed
    end
    Script ->> AWSAPI: Disable default endpoint
    Script ->> AWSAPI: Deploy API to stage with variables
    Script ->> AWSAPI: Add tags to API
    Script ->> AWSAPI: Associate custom domain with base path
    Script ->> AWSAPI: Check base path mapping
    alt Base path exists for another API
        Script ->> User: Error: Base path already exists
    else Base path mapping exists for this API
        Script ->> Script: Leave as is
    else Create base path mapping
        Script ->> AWSAPI: Create base path mapping
    end
    Script ->> User: API setup complete

```