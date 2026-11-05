# Skill — Accessibility

## Meta

Atender WCAG 2.1 AA conforme requisito do projeto.

## Teclado

Toda funcionalidade interativa deve ser utilizável por teclado.

Garantir:
- foco visível;
- ordem lógica;
- sem keyboard trap;
- `Escape` para fechar modais quando aplicável.

## Semântica

- Utilizar HTML semântico.
- Botões devem ser `<button>`.
- Links devem ser `<a>` quando navegam.
- Não transformar elementos não interativos em botões apenas com CSS.

## ARIA

Usar ARIA somente quando necessário.

Todos os controles sem texto visível devem possuir nome acessível.

## Contraste

Manter contraste adequado para WCAG 2.1 AA.

Não depender apenas de cor para comunicar estado.

## Formulários

- Labels associados.
- Mensagens de erro claras.
- Estados de validação acessíveis.
- Campos obrigatórios comunicados.

## Modais

- foco controlado quando necessário;
- `Escape`;
- nome acessível;
- fechamento previsível.

## Áudio e TTS

A reprodução de áudio não deve impedir a navegação.

O Web Speech API deve permanecer opcional e controlável pelo usuário.

## Teste

Verificar:
- teclado;
- foco;
- leitor de tela quando possível;
- contraste;
- zoom;
- mobile.
