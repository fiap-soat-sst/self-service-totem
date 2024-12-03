# language: pt
Funcionalidade: Criar pedido

  Cenário: Cliente cria o pedido sem se identificar
    Dado que o cliente não se identifica
    Quando o cliente seleciona o produto "Cheeseburger" da categoria "Lanche" nessa quantidade "1"
    E o cliente seleciona o produto "Batata Frita" da categoria "Acompanhamento" nessa quantidade "1"
    E o cliente seleciona o produto "Refrigerante Lata" da categoria "Bebida" nessa quantidade "1"
    E o cliente cria o pedido
    Então o pedido é criado com sucesso

  Cenário: Cliente cria o pedido se identificando via CPF
    Dado que o cliente se identifica via CPF "49315582080"
    Quando o cliente seleciona o produto "Veggie Burger" da categoria "Lanche" nessa quantidade "1"
    E o cliente seleciona o produto "Onion Rings" da categoria "Acompanhamento" nessa quantidade "1"
    E o cliente seleciona o produto "Suco Natural" da categoria "Bebida" nessa quantidade "1"
    E o cliente cria o pedido
    Então o pedido é criado com sucesso
