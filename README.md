# Sistema de Agendamento de Quadra de Tênis

Um sistema completo para agendamento de quadras de tênis, permitindo que jogadores reservem horários e encontrem adversários para jogar.

## Funcionalidades

- ✅ **Visualização de Quadras**: Exibe 4 quadras de tênis com diferentes tipos (Saibro, Sintética, Grama)
- ✅ **Agendamento de Horários**: Permite reservar horários específicos para jogar
- ✅ **Sistema de Adversários**: Possibilita que um segundo jogador reserve o mesmo horário como adversário
- ✅ **Interface Responsiva**: Design moderno e responsivo usando React e Tailwind CSS
- ✅ **Backend Robusto**: API REST desenvolvida em Flask com banco de dados SQLite
- ✅ **Integração Completa**: Frontend e backend totalmente integrados

## Tecnologias Utilizadas

### Frontend
- **React 18** - Framework JavaScript para interface de usuário
- **Tailwind CSS** - Framework CSS para estilização
- **shadcn/ui** - Componentes de interface modernos
- **Lucide Icons** - Ícones SVG
- **Vite** - Build tool e servidor de desenvolvimento

### Backend
- **Flask** - Framework web Python
- **SQLAlchemy** - ORM para banco de dados
- **SQLite** - Banco de dados
- **Flask-CORS** - Suporte a CORS para integração frontend-backend

## Estrutura do Projeto

```
tennis-booking-system/
├── src/                    # Código do backend Flask
│   ├── models/            # Modelos do banco de dados
│   ├── routes/            # Rotas da API
│   ├── static/            # Arquivos estáticos (frontend buildado)
│   └── main.py           # Arquivo principal do Flask
├── frontend-src/          # Código fonte do frontend React
├── venv/                  # Ambiente virtual Python
├── requirements.txt       # Dependências Python
└── README.md             # Este arquivo
```

## Como Executar

### Pré-requisitos
- Python 3.11+
- Node.js 20+
- pnpm

### Executando o Sistema

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd tennis-booking-system
   ```

2. **Configure o ambiente virtual Python**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # ou
   venv\Scripts\activate     # Windows
   ```

3. **Instale as dependências Python**
   ```bash
   pip install -r requirements.txt
   ```

4. **Execute o servidor**
   ```bash
   python src/main.py
   ```

5. **Acesse o sistema**
   - Abra o navegador em `http://localhost:5000`

### Desenvolvimento do Frontend

Se você quiser modificar o frontend:

1. **Entre no diretório do frontend**
   ```bash
   cd frontend-src
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   pnpm run dev
   ```

4. **Após as modificações, faça o build**
   ```bash
   pnpm run build
   ```

5. **Copie os arquivos para o backend**
   ```bash
   cp -r dist/* ../src/static/
   ```

## API Endpoints

### Quadras
- `GET /api/courts` - Lista todas as quadras
- `GET /api/courts/{id}` - Detalhes de uma quadra específica

### Agendamentos
- `GET /api/bookings` - Lista todos os agendamentos
- `POST /api/bookings` - Cria um novo agendamento
- `GET /api/bookings/availability/{court_id}` - Verifica disponibilidade de uma quadra

### Exemplo de Agendamento
```json
POST /api/bookings
{
  "court_id": 1,
  "time": "10:00",
  "player_name": "João Silva",
  "date": "28/08/2025"
}
```

## Como Usar o Sistema

1. **Visualizar Quadras**: Na página inicial, você verá 4 quadras com seus horários disponíveis
2. **Fazer Agendamento**: Clique em um horário disponível (verde), preencha seu nome e confirme
3. **Ser Adversário**: Clique em um horário com 1 jogador (amarelo) para se juntar como adversário
4. **Ver Agendamentos**: Na parte inferior da página, veja todos os agendamentos realizados

## Legenda de Cores

- 🟢 **Verde**: Horário disponível
- 🟡 **Amarelo**: 1 jogador (você pode ser o adversário)
- 🔴 **Vermelho**: Horário ocupado (2 jogadores)

## Contribuição

Este projeto foi desenvolvido como um sistema completo de agendamento de quadras de tênis. Sinta-se à vontade para contribuir com melhorias!

## Licença

MIT License - veja o arquivo LICENSE para detalhes.

