# GRC Ranked

Um app de treino gamificado para a certificação **CGRCP**, feito como PWA (um app web que vai para a tela inicial). Funciona no iPhone e no tablet Samsung, sem passar pelas lojas, e funciona offline depois da primeira abertura.

## O que tem dentro

| Parte do app | O que é |
|---|---|
| **Tutorial** | Na primeira abertura: codinome, agente, uma partida de treino guiada de 3 rounds (HP, headshot, Recon, explicação) e um tour do lobby. Range, Defuse e fase de compra mostram uma dica na primeira visita. Dá para pular a qualquer momento e rever em **Perfil → Rever tutorial**. |
| **Jogar** | Trilha com 8 mapas (os 7 domínios da prova + o mapa final). Cada missão é uma partida: briefing curto → termos → fase de compra → rounds de perguntas com HP. |
| **Spike** | No fim de cada mapa: uma partida de 10 rounds com o mapa inteiro. Vencer = mapa dominado. |
| **Range** | Flashcards com repetição espaçada (níveis 0 a 4). |
| **Defuse** | Toda questão errada vira uma spike. Acertar 2 vezes desarma. |
| **Intel** | Formato da prova, peso dos domínios, dicas para TDAH, fontes oficiais. |
| **Perfil** | Rank, agente, loja, sincronização, backup. |

Ranks: Ferro → Bronze → Prata → Ouro → Platina → Diamante → Ascendente → Imortal (3 divisões cada, 50 RR por divisão) → Radiante (1200 RR). Concluir a rota inteira com os simulados leva até perto de Radiante.

Os arquivos:

- `content.js`: todo o conteúdo de estudo (missões, perguntas, termos, respostas curtas). Para corrigir ou acrescentar conteúdo, é aqui.
- `app.js`: a lógica do jogo.
- `tutorial.js`: partida de treino, tour do lobby e dicas de primeira visita.
- `sync.js` e `config.js`: sincronização entre aparelhos.
- `sw.js` e `manifest.webmanifest`: fazem o app instalar e funcionar offline.

## 1. Testar no PC

Na pasta `C:\CGRCP\app`:

```powershell
python -m http.server 5173
```

Abra http://localhost:5173 no navegador.

## 2. Publicar (grátis), para abrir nos aparelhos

O app precisa estar num endereço `https://`. A forma mais simples e permanente é o **GitHub Pages**:

1. Crie um repositório no GitHub (pode ser privado só se você tiver GitHub Pro; no plano grátis o Pages precisa de repositório público). O conteúdo não tem nada pessoal: o progresso dela fica no aparelho e no Supabase, não no código.
2. Envie todos os arquivos desta pasta para o repositório.
3. No repositório: **Settings → Pages → Branch: main / root → Save**.
4. Em um ou dois minutos o app fica em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

Alternativas iguais: Cloudflare Pages ou Netlify (arrastar a pasta).

Sempre que você mudar algum arquivo e publicar de novo, o app atualiza sozinho na próxima vez que ela abrir com internet.

## 3. Ligar a sincronização (iPhone ↔ tablet)

Sem isso o app funciona, mas cada aparelho guarda o próprio progresso.

A sincronização usa um **código de 8 caracteres** (ex.: `K7PX-4QMA`), sem e-mail e sem senha. Por trás, o progresso fica guardado num projeto grátis do Supabase que só você configura, uma vez.

1. Crie uma conta e um projeto grátis em https://supabase.com.
2. No projeto: **SQL Editor → New query**, cole o conteúdo de `supabase.sql` e clique em **Run**.
3. Em **Project Settings → API**, copie a **Project URL** e a chave **anon public** para o `config.js`:

   ```js
   window.CGRC_CONFIG = {
     supabaseUrl: "https://xxxx.supabase.co",
     supabaseAnonKey: "eyJ..."
   };
   ```

4. Publique de novo.

No app:
- **Primeiro aparelho:** **Perfil → Sincronização → Gerar código**. O código aparece em letras grandes.
- **Segundo aparelho:** na tela de boas-vindas, em **"Já joga em outro aparelho?"**, digite o código e toque em **Continuar**. Ela já entra com codinome, agente e progresso, sem refazer o tutorial. (Se já tiver passado da tela inicial: **Perfil → Sincronização → Usar código**.)
- A partir daí os dois sincronizam sozinhos: depois de cada partida e sempre que o app é aberto.

### Segurança

- **Chave anon (pública):** é a única que vai no app, e foi feita para ficar pública. A chave **service_role / secret** nunca vai para o código nem para o repositório.
- **Tabela trancada:** RLS ligado e forçado, nenhuma policy e nenhuma permissão para `anon`/`authenticated`. Ninguém lê, lista, grava ou apaga a tabela diretamente.
- **Só duas portas:** `sync_get` e `sync_put`. Elas só leem ou gravam o progresso de um código exato, que tem 8 caracteres (cerca de 850 bilhões de combinações).
- **Limites contra abuso:** no máximo 10 códigos no banco, cada progresso com até 300 KB e só no formato de objeto JSON.
- **No app:** todo progresso que chega da nuvem ou de um backup é reconstruído campo a campo, com tipos e tamanhos conferidos, antes de aparecer na tela. Texto nunca vira HTML.
- **Content-Security-Policy:** a página só carrega scripts próprios e só conversa com este projeto Supabase e com as fontes do Google.
- O Security Advisor do Supabase mostra 2 avisos de "SECURITY DEFINER callable without signing in". Eles são esperados: é a sincronização por código, sem login.
- Trate o código de sincronização como uma senha simples e não o publique.

## 4. Instalar nos aparelhos dela

**iPhone (Safari):**
1. Abra o endereço do app no **Safari** (precisa ser o Safari).
2. Toque em **Compartilhar** (quadrado com seta) → **Adicionar à Tela de Início** → **Adicionar**.
3. Abra pelo ícone. Ele roda em tela cheia, como um app.
4. Gere ou digite o código de sincronização **dentro do app instalado**. No iPhone, o app da tela inicial guarda dados separados do Safari.

**Tablet Samsung (Chrome ou Samsung Internet):**
1. Abra o endereço do app.
2. Chrome: menu **⋮ → Instalar app** (ou **Adicionar à tela inicial**). Samsung Internet: menu **≡ → Adicionar página a → Tela inicial**.
3. Abra pelo ícone e digite o código de sincronização.

## Observações

- No iPhone não há vibração (o iOS não deixa apps web vibrarem). No tablet, sim.
- O som começa depois do primeiro toque na tela. Dá para desligar em **Perfil → Ajustes**.
- Visual inspirado em shooters táticos, com nomes e agentes próprios. Não usa logos, artes nem personagens da Riot.
- **Perfil → Backup manual** gera um texto com todo o progresso. Bom para guardar de vez em quando, mesmo com a sincronização ligada.
