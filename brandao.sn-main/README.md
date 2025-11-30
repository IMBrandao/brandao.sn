<div align="center">
  <h1>brandao.sn 🚀</h1>
  <p>
    <b>Landing page oficial do domínio <code>brandao.sn</code></b><br>
    <i>Construindo uma presença digital inovadora</i>
  </p>
  <a href="https://brandao.sn"><img src="https://img.shields.io/badge/online-preview-blue?style=flat-square" alt="Preview"/></a>
  <a href="https://github.com/IMBrandao/brandao.sn/issues"><img src="https://img.shields.io/github/issues/IMBrandao/brandao.sn?style=flat-square" alt="Issues"/></a>
  <a href="https://github.com/IMBrandao"><img src="https://img.shields.io/badge/author-IMBrandao-green?style=flat-square" alt="Author"/></a>
</div>

---

## ✨ Visão Geral

O **brandao.sn** é uma landing page moderna e responsiva, pensada para uma ótima experiência ao usuário.  
Este repositório concentra todo o desenvolvimento e evolução do projeto.

---

## 🛠️ Tecnologias

- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-plain.svg" width="24" /> **HTML5** para as páginas estáticas
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-plain.svg" width="24" /> **CSS3 modular** (`css/base.css`, `css/components.css`, `css/pages.css`)
- <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-plain.svg" width="24" /> **Vanilla JavaScript** para interações, simuladores e montagem dinâmica de layout
- **Fetch API** para carregar `partials/header.html` e `partials/footer.html`

---

## 🧱 Arquitetura

- **Partials**: cabeçalho e rodapé são renderizados em tempo de execução via `js/layout.js`, mantendo consistência entre páginas.
- **CSS dividido**: a antiga `style.css` foi desmembrada em módulos para facilitar manutenção e cache.
- **Scripts focados**: efeitos globais e simuladores (GlideAjax, partículas, menu, modais) ficam isolados em módulos dentro de `js/`.

---

## 🚧 Status

> **Em construção!**  
> Novidades em breve. Fique de olho no nosso [preview online](https://brandao.sn).

---

## ⚡ Como usar localmente

O `js/layout.js` agora possui um fallback para carregar `partials/` mesmo quando o site é aberto via `file://`, então basta abrir `index.html` no navegador para uma visualização rápida.

Se preferir simular um ambiente mais próximo do deploy, suba um servidor estático simples:

```bash
git clone https://github.com/IMBrandao/brandao.sn.git
cd brandao.sn
python -m http.server 8080
```

Depois, acesse [http://localhost:8080](http://localhost:8080) e navegue normalmente.

---

## 💡 Contribuindo

1. Faça um fork
2. Crie uma branch: `git checkout -b minha-feature`
3. Envie suas alterações com um Pull Request

---

## 👤 Autor

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/IMBrandao">
        <!-- avatar: use o ID numérico (ex.: 12345678) ou prefira a forma sem ID -->
        <img src="https://avatars.githubusercontent.com/IMBrandao" width="100" alt="Foto de Itallo Brandão"/>
        <br/>
        <sub><strong>Itallo M. Brandão</strong></sub>
      </a>
      <br/>
      <a href="https://www.linkedin.com/in/itallobrandao/">
        <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white" alt="LinkedIn"/>
      </a>
      <a href="https://github.com/IMBrandao">
        <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub"/>
      </a>
    </td>
  </tr>
</table>


---

## 📜 Licença

Este projeto ainda não possui uma licença definida.

---

<div align="center">
  <strong>Feito com ❤️ por IMBrandao</strong>
</div>
