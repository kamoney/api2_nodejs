# API V2 Kamoney

Seja bem vindo à nova versão de nossa API de operação.

Recomendamos que migre o uso para nossa nova API, o quanto antes, pois a versão anterior será descontinuada em breve. 

Esta documentação visa detalhar métodos, exemplos práticos de requisição e retorno de dados, buscando facilitar sua implementação e consumo.

Todas as consultas retornam sempre um código HTTP Status 200, salvo em casos de falhas em nossos servidores, que enviará um código conforme o erro, como por exemplo HTTP Status 500.

O retorno será em formato JSON (application/json), de acordo com cada endpoint.

### Padronização de retornos da API.

Nossa API, sempre irá retornar em seu objeto, o atributo "success". Ele irá retornar em caso de suscesso um true e em caso de erro um false.

Quando o atributo for success=true irá retornar um atributo do tipo String chamado "msg", que conterá o texto referente ao que foi solicitado. Quando o atributo for success=false irá retornar um atributo do tipo String chamado "error", que conterá a mensagem referente ao erro ocorrido.

Haverá também um atributo "data", que conterá o conteúdo solicitado, de acordo com o método utilizado. Por exmeplo, em um GET, poderá haver duas formas básicas:

- Objeto simples. EX.: "data": {id: 1, "name": "João Fulano" }
- Lista (array) de objetos. EX.: "data": [{id: 1, "name": "Item 1" }, {id: 1, "name": "Item 2" }, ...]

##### Retorno do tipo success=true e data=object:

```
{"success": true, "msg": "", "data": {}}
```

##### Retorno do tipo success=true e data=array:

```
{"success": true, "msg": "", "data": [{}, {}, ...]}
```

##### Retorno do tipo success=false:

```
{"success": false, "error": "Mensagem de erro", "code": "codigo_do_erro"}
```
Em breve disponibilizaremos em nosso repositório no GitHub, nossos SDKs para reutilização, e melhor implementação de nossa API V.2.
Como funciona?

Os endpoints estão separados entre PÚBLICOS e PRIVADOS.

Endpoints públicos, como sugere, estão abertos para consultas sem envio de identificação do usuário, enquanto que os privados, é necessário enviar as credenciais.
Como realizar a autenticação?

Nossa API funciona com múltiplo modo de autenticação, que são:

- Autenticação via Token JWT;
- Autenticação via Public Key e Sign.

Este método, é utilizado quando o cliente cria uma chave de API em nossa plataforma.

### Autenticação via Token JWT

A autenticação via token JWT, ela se baseia em um token JWT passado no header, como forma de autenticação. O token JWT em questão, deve ser gerado utilizando nosso endpoint de /v2/public/auth.
Autenticação via Public e Sign

A autenticação via Public Key e Sign, se baseia em uma assinatura dos dados enviados, assinados via Secret obtida na geração de uma nova API, em nossa plataforma.

Ao criar sua conta junto à Kamoney, você terá acesso ao menu API. Nele, você poderá gerar suas chaves de API, public e secret. De posse de suas chaves, você deverá realizar assinatura dos dados enviados, via algoritmo HMAC.

A assinatura HMAC é um algoritmo que assina as mensagens, assegurando a procedência dos dados enviados. Tal assinatura, deverá ser enviada juntamente com sua public no header da solicitação. Esta documentação não possui uma sessão própria para exemplificar a autenticação com base em sua assinatura HMAC, mas vamos fazer nosso melhor.

Caso você deseje implementar nossa API aconselhamos utilizar a autenticação via PUBLIC KEY e SIGN.

### Autenticação via Public Key e Sign

Em toda requisição privada, deverão ser envidas obrigatoriamente duas informações em seu cabeçalho:

- public: Sua chave pública. Tal chave é obtida ao criar uma nova API na plataforma.
- sign: Sua assinatura via algoritmo HMAC sha512 e chave secreta. Essa assinatura é realizada do lado do cliente, servindo-se da chave secreta, obtida na criação da API em nossa plataforma. Essa chave é de posse unica e exclusiva do cliente. A Kamoney, através da Public Key recebida, consegue obter a Scret Key do cliente, e realizar a validação da sign enviada para autenticar a veracidade da solicitação.

##### Importante: Em todas as requisições, envie o microtime atual (nonce), para que haja uma sign assinada.

Confira mais detalhes em uso dos métodos em https://doc2.kamoney.com.br.
