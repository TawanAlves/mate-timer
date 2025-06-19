| Etapa             | Comando                            | O que acontece                                   |
| ----------------- | ---------------------------------- | ------------------------------------------------ |
| Começar feature   | `git flow feature start nome`      | Cria branch baseada em `develop`                 |
| Finalizar feature | `git flow feature finish nome`     | Mescla na `develop`                              |
| Criar versão      | `git flow release start 1.0.0`     | Copia estado atual da `develop`                  |
| Finalizar versão  | `git flow release finish 1.0.0`    | Mescla na `main`, cria tag, envia para `develop` |
| Enviar versão     | `git push --all` `git push --tags` | envia todas as branches e tag                    |
