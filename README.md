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

Diagrama de Sequencia
```mermaid
sequenceDiagram
    participant User
    participant Script
    participant "AWS API Gateway" as AWSAPI
    participant "Amazon VPC Endpoint" as VPC

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

Digrama de Fluxo
```mermaid
graph TD
    A[Start] --> B[Read spec-output.yaml]
    B --> C[Get AWS client using profile]
    C --> D{API exists?}
    D -->|Yes| E[Backup API state]
    D -->|No| G[Create new API]
    E --> F[Update API]
    G --> H{Private API?}
    F --> H{Private API?}
    H -->|Yes| I[Configure private API with VPC endpoint and policy]
    H -->|No| J[Configure regional API]
    I --> K[Disable default endpoint]
    J --> K[Disable default endpoint]
    K --> L[Deploy API to stage with variables]
    L --> M[Add tags to API]
    M --> N[Associate custom domain with base path]
    N --> O{Base path exists for another API?}
    O -->|Yes| P[Error: Base path already exists]
    O -->|No| Q[Base path mapping exists for this API?]
    Q -->|Yes| R[Leave as is]
    Q -->|No| S[Create base path mapping]
    P --> T[End]
    R --> T[End]
    S --> T[End]
```

Diagrama de Caso de uso
```mermaid
graph TD;
    User -->|Run script with parameters| Script;
    Script -->|Check API exists| AWSAPI;
    AWSAPI -->|Update API| UpdateAPI;
    AWSAPI -->|Create new API| CreateAPI;
    CreateAPI -->|Configure VPC endpoint and policy| VPC;
    UpdateAPI -->|Configure VPC endpoint and policy| VPC;
    Script -->|Check if API is private| AWSAPI;
    AWSAPI -->|Disable default endpoint| AWSAPI;
    AWSAPI -->|Deploy API to stage with variables| AWSAPI;
    AWSAPI -->|Add tags to API| AWSAPI;
    AWSAPI -->|Associate custom domain with base path| AWSAPI;
    AWSAPI -->|Check base path mapping| AWSAPI;
    AWSAPI -->|Create base path mapping| AWSAPI;

```

Diagrama de Estado
```mermaid
stateDiagram
    [*] --> Script

    state Script {
        [*] --> CheckAPIExists
        CheckAPIExists --> UpdateAPI : API exists
        CheckAPIExists --> CreateAPI : API does not exist

        state UpdateAPI {
            --> BackupAPIState
            --> UpdateAPI
            --> ConfigureVPC : Private API
            --> DisableEndpoint
            --> DeployAPI
            --> AddTags
            --> AssociateDomain
            --> CheckBasePathMapping
            --> [*]
        }

        state CreateAPI {
            --> CreateAPI
            --> ConfigureVPC : Private API
            --> DisableEndpoint
            --> DeployAPI
            --> AddTags
            --> AssociateDomain
            --> CheckBasePathMapping
            --> [*]
        }

        state ConfigureVPC {
            --> ConfigureVPC
            --> [*]
        }
    }

```

Diagrama de Atividades
```mermaid
journey
    title "Automated API Setup"

    section Setup
        User:
            - Run script with parameters
            - Read spec-output.yaml
            - Get AWS client using profile

    section "Check API"
        Script:
            - Check if API exists (by title)
            - if API exists:
                - Backup API state
                - Update API
            - else:
                - Create new API

    section "Configure API"
        Script:
            - Check if API is private?
                - if Private API:
                    - Configure VPC endpoint and policy
                - else:
                    - No VPC configuration needed

            - Disable default endpoint
            - Deploy API to stage with variables
            - Add tags to API
            - Associate custom domain with base path
            - Check base path mapping

            - if Base path exists for another API:
                - Error: Base path already exists
            - else:
                - if Base path mapping exists for this API:
                    - Leave as is
                - else:
                    - Create base path mapping

            - API setup complete

```

Diagrama de Componentes
```mermaid
graph TD;
    User --> Script;
    Script --> "AWS API Gateway";
    Script --> "Amazon VPC Endpoint";
```