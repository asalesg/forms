const LISTA = {
    SolicitacaoAcesso:  "faa7d700-9746-45e1-9c18-ab85b5d18336",
    Keyusers: "52c66564-8c03-4897-a5f1-12d8d43e3590",
    Grupos: "93f3c7ef-ec98-47c4-a4ad-10ce88aa4c97",
    Atribuicoes: "69cafc12-843b-4412-af24-1af804719e9b",
  };
  var REFERENCE_USER = null;
  var ID = null;
  var delayTimer;
  var SOLICITACAO_DATA = {};
  
  const REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{20}$/;
  
  //#region proto
  
  Date.prototype.toDateTimeLocaleHTML = function (tz = 3) {
    let dt = new Date(this.getTime() - tz * 60 * 60000);
    return dt.toISOString().substring(0, 10) + "T" + dt.toLocaleTimeString();
  };
  
  //#endregion
  
  function getID() {
    if (ID) return ID;
    else {
      const urlParams = new URLSearchParams(location.search.toLocaleUpperCase());
      ID = urlParams.get("ID");
      return ID;
    }
  }
  
  async function handleGrupos() {
    const grupos = document.getElementById("grupos");
    grupos.removeAttribute("readonly");
    const todosGrupos = (
      await getItem(
        (siteUrl = window.location.origin),
        (listID = LISTA.Grupos),
        (itemID = undefined),
        (filter = undefined),
        (select = "Id,Title,Sysid"),
        (orderby = "Title"),
        (maxResult = 1000)
      )
    ).d.results;
  
    todosGrupos
      .filter((item) => !REGEX.test(item.Title))
      .forEach((grp) => {
        grupos.innerHTML += `<option value='${grp.Id}'>${grp.Title}</option>`;
      });
  }
  
  async function checkKeyUser() {
    const keyusers = (
      await getItem(
        (siteUrl = window.location.origin),
        (listID = LISTA.Keyusers),
        (itemID = undefined),
        (filter = `Title eq '${SOLICITACAO_DATA.Localidade}' and KeyUserId eq ${CURRENT_USER.Id}`),
        (select = "KeyUser/Id,KeyUser/Title,KeyUser/EMail"),
        (orderby = "KeyUser/Title"),
        (maxResult = 20),
        (expand = "KeyUser")
      )
    ).d.results;
    if (keyusers.length) {
      const keyuser = keyusers[0].KeyUser;
      document.getElementById("usuarioChaveId").value = keyuser.Id;
      document.getElementById("usuarioChaveNome").value = keyuser.Title;
      document.getElementById("usuarioChaveEmail").value = keyuser.EMail;
    } else {
      document.getElementById("btnApprove").setAttribute("hidden", "true");
      document.getElementById("btnDisapprove").setAttribute("hidden", "true");
      alert("KeyUser não encontrado. Por favor acompanhe o chamado pelo número: " + SOLICITACAO_DATA.TicketNumber);
      window.location.href = "https://csc.hypera.com.br/";
    }
  }
  async function handleGruposSelecionados(onlySelected = true) {
    const grupos = document.getElementById("grupos");
    const list = SOLICITACAO_DATA.Grupos?.results ?? [];
    if (onlySelected) {
      list.forEach((grp) => {
        grupos.innerHTML += `<option selected value='${grp.Id}'>${grp.Title}</option>`;
      });
    } else {
      list.forEach((g) => {
        document.querySelector(
          `#grupos > option[value='${g.Id}']`
        ).selected = true;
      });
    }
    const span = document.querySelector(`label[for='grupos'] span`);
    span.innerText = list.length;
    span.title = list.map((opt) => opt.Title).join("; ");
  }
  async function handleAtribuicoes() {
    const atribuicoes = document.getElementById("atribuicoes");
    atribuicoes.removeAttribute("readonly");
    const todasAtribuicoes = (
      await getItem(
        (siteUrl = window.location.origin),
        (listID = LISTA.Atribuicoes),
        (itemID = undefined),
        (filter = undefined),
        (select = "Id,Title,Sysid"),
        (orderby = "Title"),
        (maxResult = 1000)
      )
    ).d.results;
  
    todasAtribuicoes
      .filter((item) => !REGEX.test(item.Title))
      .forEach((grp) => {
        atribuicoes.innerHTML += `<option value='${grp.Id}'>${grp.Title}</option>`;
      });
  }
  async function handleAtribuicoesSelecionadas(onlySelected = true) {
    const atribuicoes = document.getElementById("atribuicoes");
    const list = SOLICITACAO_DATA.Atribuicoes?.results ?? [];
    if (onlySelected) {
      list.forEach((a) => {
        atribuicoes.innerHTML += `<option selected value='${a.Id}'>${a.Title}</option>`;
      });
    } else {
      list.forEach((a) => {
        document.querySelector(
          `#atribuicoes > option[value='${a.Id}']`
        ).selected = true;
      });
    }
    const span = document.querySelector(`label[for='atribuicoes'] span`);
    span.innerText = list.length;
    span.title = list.map((opt) => opt.Title).join("; ");
  }
  async function findUser(ev) {
    const { value } = ev.target;
    const listId = ev.srcElement.list.id;
    const user = listId === "list-users-to" ? "usuarioAfetado" : "usuarioEspelho";
    if (value.length < 4) {
      document.getElementById(`${user}Email`).value = "";
      document.getElementById(`${user}Id`).value = "";
      if (user === "usuarioEspelho") {
        profileRequired(true);
      }
      return;
    }
  
    clearTimeout(delayTimer); // Limpa o temporizador anterior se houver
  
    // Define um novo temporizador para aguardar 500 milissegundos (ou qualquer valor que você preferir)
    delayTimer = setTimeout(async function () {
      // Executar após atraso
      var valorInput = document.getElementById(`${user}Nome`).value;
  
      let list = await Promise.all([
        findUserByName(valorInput.toLowerCase(), 10),
        findUserByEmail(valorInput.toLowerCase(), 10),
      ])
        .then((result) => {
          var merge = (a, b, p) =>
            a.filter((aa) => !b.find((bb) => aa[p] === bb[p])).concat(b);
          return merge(result[0], result[1], "Id").filter(
            (user) =>
              !user.Title.toLowerCase().endsWith("adm") &&
              !user.Email.toLowerCase().endsWith("adm") &&
              !user.Title.toLowerCase().endsWith("admfs") &&
              !user.Email.toLowerCase().endsWith("admfs")
          );
        })
        .catch((response) => {
          console.error(response);
          return [];
        });
      document.getElementById(listId).innerHTML = "";
      if (list && list.length) {
        list.forEach((el) => {
          document.getElementById(
            listId
          ).innerHTML += `<option value="${el.Title}">${el.Email}</option>`;
        });
        if (list.length === 1) {
          REFERENCE_USER = list[0];
          document.getElementById(`${user}Nome`).value = REFERENCE_USER.Title;
          document.getElementById(`${user}Email`).value = REFERENCE_USER.Email;
          document.getElementById(`${user}Id`).value = REFERENCE_USER.Id;
          if (user === "usuarioEspelho") {
            profileRequired(false);
          }
        }
      } else alert("USUÁRIO NÃO ENCONTRADO");
    }, 500); // Aguarda 500 milissegundos (0,5 segundos) antes de executar o código
  }
  async function countSelectedItems(ev) {
    const field = ev.target.id;
    const options = Array.from(ev.target.options).filter((el) => el.selected);
    const span = document.querySelector(`label[for='${field}'] span`);
    span.innerText = options.length;
    span.title = options.map((opt) => opt.innerText).join("; ");
  }
  
  function profileRequired(isRequired) {
    if (isRequired) {
      ["grupos", "atribuicoes"].forEach((field) => {
        document.getElementById(field).parentNode.removeAttribute("hidden");
        document.getElementById(field).removeAttribute("hidden");
        document.getElementById(field).removeAttribute("readonly");
        // document.getElementById(field).setAttribute('required', 'true');
      });
    } else {
      ["grupos", "atribuicoes"].forEach((field) => {
        document.getElementById(field).parentNode.setAttribute("hidden", "true");
        document.getElementById(field).setAttribute("readonly", "true");
        // document.getElementById(field).removeAttribute('required');
      });
    }
  }
  
  document.addEventListener("DOMContentLoaded", async function (e) {
    document
      .getElementById("atribuicoes")
      .addEventListener("change", countSelectedItems);
    document
      .getElementById("grupos")
      .addEventListener("change", countSelectedItems);
    document.getElementById("tipoSolicitacao").addEventListener("change", () => {
      const TipoSolicitacao = document.getElementById("tipoSolicitacao").value;
      if (TipoSolicitacao == "Liberação") {
        alert(
          "Para liberação é obrigatório o preenchimento do usuário espelho ou Grupos e Atribuições."
        );
        document.getElementById("grupos").parentNode.parentNode.style.display =
          "flex";
        document.getElementById(
          "usuarioEspelhoEmail"
        ).parentNode.parentNode.style.display = "flex";
      } else if (TipoSolicitacao == "Alteração") {
        alert(
          "Escolha os grupos e atribuições que o usuário já possui para 'incluir'. "
        );
        document.getElementById("grupos").parentNode.parentNode.style.display =
          "flex";
        document.getElementById(
          "usuarioEspelhoEmail"
        ).parentNode.parentNode.style.display = "flex";
      } else  {
        // Esconder os três campos aqui
        // Por exemplo:
        document.getElementById("grupos").parentNode.parentNode.style.display =
          "none";
        document.getElementById(
          "usuarioEspelhoEmail"
        ).parentNode.parentNode.style.display = "none";
      }
    });
  
    CURRENT_USER = await getCurrentUser();
    if (!getID()) {
      console.log("Novo registro!");
      document.getElementById("secKeyuser").style.display = "none";
      document.getElementById("secGestor").style.display = "none";
      document.getElementById("solicitanteNome").value = CURRENT_USER.Title;
      document.getElementById("solicitanteEmail").value = CURRENT_USER.Email;
      [
        "usuarioAfetadoNome",
        "usuarioEspelhoNome",
        "localidade",
        "tipoSolicitacao",
        "justificativa",
      ].forEach((field) =>
        document.getElementById(field).removeAttribute("readonly")
      );
      await handleGrupos();
      await handleAtribuicoes();
      handleGruposSelecionados(false);
      handleAtribuicoesSelecionadas(false);
      document
        .getElementsByName("user-lookup")
        .forEach((el) => el.addEventListener("input", findUser));
      document.getElementById("btnSave").addEventListener("click", saveRequest);
      document.getElementById("btnSave").removeAttribute("hidden");
      document.getElementById("btnCancel").addEventListener("click", exitRequest);
      document.getElementById("btnCancel").removeAttribute("hidden");
    } else {
      SOLICITACAO_DATA = (
        await getItem(
          (siteUrl = window.location.origin),
          (listID = LISTA.SolicitacaoAcesso),
          (itemID = ID),
          (filter = undefined),
          (select =
            "Id,Title,TipoSolicitacao,Localidade,Justificativa,EstadoFluxo,UsuarioAfetado/Title,UsuarioAfetado/EMail,UsuarioAfetado/Id,UsuarioEspelho/Title,UsuarioEspelho/EMail,UsuarioEspelho/Id,UsuarioChave/Title,UsuarioChave/EMail,UsuarioChave/Id,UsuarioSolicitante/Title,UsuarioSolicitante/EMail,UsuarioSolicitante/Id,Grupos/Id,Grupos/Title,Atribuicoes/Id,Atribuicoes/Title,DataRespostaKeyuser,DataRespostaGestor,UsuarioGestor/Title,UsuarioGestor/EMail,UsuarioGestor/Id,justificativaKeyUser,TicketNumber"),
          (orderby = undefined),
          (maxResult = undefined),
          (expand =
            "UsuarioAfetado,UsuarioEspelho,UsuarioChave,UsuarioSolicitante,Grupos,Atribuicoes,UsuarioGestor")
        )
      ).d;
      document.getElementById("EstadoFluxo").innerText =
        SOLICITACAO_DATA.EstadoFluxo;
      document.getElementById("solicitanteNome").value =
        SOLICITACAO_DATA.UsuarioSolicitante.Title;
      document.getElementById("solicitanteEmail").value =
        SOLICITACAO_DATA.UsuarioSolicitante.EMail;
      document.getElementById("usuarioAfetadoNome").value =
        SOLICITACAO_DATA.UsuarioAfetado.Title;
      document.getElementById("usuarioAfetadoEmail").value =
        SOLICITACAO_DATA.UsuarioAfetado.EMail;
      document.getElementById("usuarioEspelhoNome").value =
        SOLICITACAO_DATA.UsuarioEspelho.Title;
      document.getElementById("usuarioEspelhoEmail").value =
        SOLICITACAO_DATA.UsuarioEspelho.EMail;
      document.getElementById("localidade").value = SOLICITACAO_DATA.Localidade;
      document.getElementById("tipoSolicitacao").value =
        SOLICITACAO_DATA.TipoSolicitacao;
      document.getElementById("justificativa").value =
        SOLICITACAO_DATA.Justificativa;
  
      // TODO: Validar etapa do fluxo
      switch (SOLICITACAO_DATA.EstadoFluxo) {
        case "Aprovação Keyuser":
          await checkKeyUser();
          await handleGrupos();
          await handleAtribuicoes();
          handleGruposSelecionados(false);
          handleAtribuicoesSelecionadas(false);
          ["grupos", "atribuicoes"].forEach((field) =>
            document.getElementById(field).removeAttribute("readonly")
          );
          document.getElementById("usuarioChaveId").value = CURRENT_USER.Id;
          document.getElementById("usuarioChaveNome").value = CURRENT_USER.Title;
          document.getElementById("usuarioChaveEmail").value = CURRENT_USER.Email;
          let dt = new Date();
          dt.setHours(dt.getHours() - 3);
          document.getElementById("usuarioChaveDataAprovacao").value = dt
            .toISOString()
            .substring(0, 19);
          document
            .getElementById("btnApprove")
            .addEventListener("click", () => saveResultRequest(true));
          document
            .getElementById("justificativaKeyUser")
            .removeAttribute("readonly");
          document.getElementById("usuarioEspelhoNome").value =
            SOLICITACAO_DATA.UsuarioEspelho.Title ?? "";
          document.getElementById("usuarioEspelhoEmail").value =
            SOLICITACAO_DATA.UsuarioEspelho.EMail ?? "";
          document.getElementById("btnApprove").removeAttribute("hidden");
          document
            .getElementById("btnDisapprove")
            .addEventListener("click", () => saveResultRequest(false));
          document.getElementById("btnDisapprove").removeAttribute("hidden");
          break;
        case "Aprovação Gestor":
          handleGruposSelecionados();
          handleAtribuicoesSelecionadas();
          document.getElementById("usuarioEspelhoNome").value =
            SOLICITACAO_DATA.UsuarioEspelho.Title ?? "";
          document.getElementById("usuarioEspelhoEmail").value =
            SOLICITACAO_DATA.UsuarioEspelho.EMail ?? "";
          document.getElementById("usuarioChaveId").value =
            SOLICITACAO_DATA.UsuarioChave.Id;
          document.getElementById("usuarioChaveNome").value =
            SOLICITACAO_DATA.UsuarioChave.Title;
          document.getElementById("usuarioChaveEmail").value =
            SOLICITACAO_DATA.UsuarioChave.EMail;
          document.getElementById("usuarioGestorNome").value =
            SOLICITACAO_DATA.UsuarioGestor.Title;
          document.getElementById("usuarioGestorEmail").value =
            SOLICITACAO_DATA.UsuarioGestor.EMail;
          document.getElementById("justificativaKeyUser").value =
            SOLICITACAO_DATA.justificativaKeyUser ?? "";
          document.getElementById("usuarioChaveDataAprovacao").value = new Date(
            SOLICITACAO_DATA.DataRespostaKeyuser
          ).toDateTimeLocaleHTML(0);
          let gestAprov = new Date();
          gestAprov.setHours(gestAprov.getHours() - 3);
          document.getElementById("usuarioGestorDataAprovacao").value = gestAprov
            .toISOString()
            .substring(0, 19);
  
          if (CURRENT_USER.Title == SOLICITACAO_DATA.UsuarioGestor.Title) {
            document.getElementById("btnApprove").removeAttribute("hidden");
            document.getElementById("btnDisapprove").removeAttribute("hidden");
            document
              .getElementById("btnApprove")
              .addEventListener("click", () => saveResultRequest(true));
            document
              .getElementById("btnDisapprove")
              .addEventListener("click", () => saveResultRequest(false));
          }
          break;
        case "Rejeitado Keyuser":
          handleGruposSelecionados();
          handleAtribuicoesSelecionadas();
          document.getElementById("usuarioEspelhoNome").value =
            SOLICITACAO_DATA.UsuarioEspelho.Title ?? "";
          document.getElementById("usuarioEspelhoEmail").value =
            SOLICITACAO_DATA.UsuarioEspelho.EMail ?? "";
          document.getElementById("usuarioChaveDataAprovacao").value = new Date(
            SOLICITACAO_DATA.DataRespostaKeyuser
          ).toDateTimeLocaleHTML(0);
          document.getElementById("usuarioChaveNome").value =
            SOLICITACAO_DATA.UsuarioChave.Title;
          document.getElementById("usuarioChaveEmail").value =
            SOLICITACAO_DATA.UsuarioChave.EMail;
          document
            .getElementById("usuarioGestorDataAprovacao")
            .parentNode.parentNode.setAttribute("hidden", "true");
          document.getElementById("justificativaKeyUser").value =
            SOLICITACAO_DATA.justificativaKeyUser ?? "";
          break;
        case "Rejeitado Gestor":
          handleGruposSelecionados();
          handleAtribuicoesSelecionadas();
          document.getElementById("usuarioEspelhoNome").value =
            SOLICITACAO_DATA.UsuarioEspelho.Title ?? "";
          document.getElementById("usuarioEspelhoEmail").value =
            SOLICITACAO_DATA.UsuarioEspelho.EMail ?? "";
          document.getElementById("usuarioChaveDataAprovacao").value = new Date(
            SOLICITACAO_DATA.DataRespostaKeyuser
          ).toDateTimeLocaleHTML(0);
          document.getElementById("usuarioChaveNome").value =
            SOLICITACAO_DATA.UsuarioChave.Title;
          document.getElementById("usuarioChaveEmail").value =
            SOLICITACAO_DATA.UsuarioChave.EMail;
          document.getElementById("usuarioGestorNome").value =
            SOLICITACAO_DATA.UsuarioGestor.Title;
          document.getElementById("usuarioGestorEmail").value =
            SOLICITACAO_DATA.UsuarioGestor.EMail;
          document.getElementById("usuarioGestorDataAprovacao").value = new Date(
            SOLICITACAO_DATA.DataRespostaGestor
          ).toDateTimeLocaleHTML(0);
          document.getElementById("justificativaKeyUser").value =
            SOLICITACAO_DATA.justificativaKeyUser ?? "";
          break;
        case "Aprovado":
        case "Encerrado":
          handleGruposSelecionados();
          handleAtribuicoesSelecionadas();
          document.getElementById("usuarioEspelhoNome").value =
            SOLICITACAO_DATA.UsuarioEspelho.Title ?? "";
          document.getElementById("usuarioEspelhoEmail").value =
            SOLICITACAO_DATA.UsuarioEspelho.EMail ?? "";
          document.getElementById("usuarioChaveDataAprovacao").value = new Date(
            SOLICITACAO_DATA.DataRespostaKeyuser
          ).toDateTimeLocaleHTML(0);
          document.getElementById("usuarioChaveNome").value =
            SOLICITACAO_DATA.UsuarioChave.Title;
          document.getElementById("usuarioChaveEmail").value =
            SOLICITACAO_DATA.UsuarioChave.EMail;
          document.getElementById("usuarioGestorNome").value =
            SOLICITACAO_DATA.UsuarioGestor.Title;
          document.getElementById("usuarioGestorEmail").value =
            SOLICITACAO_DATA.UsuarioGestor.EMail;
          document.getElementById("usuarioGestorDataAprovacao").value = new Date(
            SOLICITACAO_DATA.DataRespostaGestor
          ).toDateTimeLocaleHTML(0);
          document.getElementById("justificativaKeyUser").value =
            SOLICITACAO_DATA.justificativaKeyUser ?? "";
          break;
        default:
          break;
      }
    }
  });
  
  function exitRequest() {
    window.location.href = "https://csc.hypera.com.br/";
  }
  
  async function saveRequest() {
    const form = document.forms["myForm"];
    if (form.checkValidity() === false) {
      alert("Erro! Revise o preenchimento do formulário.");
    } else if (
      document.getElementById("tipoSolicitacao").value !== "Revogação" &&
      !document.getElementById("usuarioEspelhoId").value &&
      !document.getElementById("grupos").value &&
      !document.getElementById("atribuicoes").value
    ) {
      alert(
        "Para solicitações de liberação ou alteração é necessário informar um usuário espelho ou informar grupos e atribuições."
      );
      return;
    } else {
      const body = {
        __metadata: {
          type: "SP.Data.DocnixSolicitacaoAcessoListItem",
          ContentTypeId: "0x010038BAEE253EDA624E9453FD6FFCC9ADFC",
        },
        Title: new Date().toISOString().slice(0, 10),
        TipoSolicitacao: document.getElementById("tipoSolicitacao").value,
        Localidade: document.getElementById("localidade").value,
        Justificativa: document.getElementById("justificativa").value,
        GruposId: {
          results: Array.from(
            document.querySelectorAll("#grupos > option:checked")
          ).map((el) => parseInt(el.value)),
        },
        AtribuicoesId: {
          results: Array.from(
            document.querySelectorAll("#atribuicoes > option:checked")
          ).map((el) => parseInt(el.value)),
        },
        UsuarioAfetadoId: parseInt(
          document.getElementById("usuarioAfetadoId").value
        ),
        UsuarioEspelhoId: parseInt(
          document.getElementById("usuarioEspelhoId").value
        ),
        UsuarioChaveId:
          parseInt(document.getElementById("usuarioChaveId").value) || null,
        UsuarioSolicitanteId: CURRENT_USER.Id,
        EstadoFluxo: "Aberto",
      };
      await postItem("", LISTA.SolicitacaoAcesso, await getDigest(), body)
        .then((result) => {
          console.log(result);
          alert("Sucesso! O item foi solicitado com sucesso.");
        })
        .catch((error) => {
          alert("Erro! Desculpe, não foi possível concluir o registro");
          console.error("Falha ao criar o item na lista.", error);
        })
        .finally((_) => exitRequest());
    }
  }
  
  async function saveResultRequest(approved = false) {
    const form = document.forms["myForm"];
    if (form.checkValidity() === false) {
      alert("Erro! Revise o preenchimento do formulário.");
    } else {
      const body = {
        __metadata: {
          type: "SP.Data.DocnixSolicitacaoAcessoListItem",
          ContentTypeId: "0x010038BAEE253EDA624E9453FD6FFCC9ADFC",
        },
      };
      if (SOLICITACAO_DATA.EstadoFluxo == "Aprovação Keyuser") {
        body["EstadoFluxo"] = approved ? "Aprovação Gestor" : "Rejeitado Keyuser";
        if (
          !approved &&
          document.getElementById("justificativaKeyUser").value.length < 30
        ) {
          return alert(
            "É necessário justificar a rejeição com, no mínimo, 30 caracteres."
          );
        }
        body["justificativaKeyUser"] = document.getElementById(
          "justificativaKeyUser"
        ).value;
  
        body["DataRespostaKeyuser"] = new Date().toISOString();
        body["UsuarioChaveId"] = parseInt(
          document.getElementById("usuarioChaveId").value
        );
        if (approved) {
          body["AtribuicoesId"] = {
            results: Array.from(document.getElementById("atribuicoes").childNodes)
              .filter((el) => el.selected)
              .map((el) => parseInt(el.value)),
          };
          body["GruposId"] = {
            results: Array.from(document.getElementById("grupos").childNodes)
              .filter((el) => el.selected)
              .map((el) => parseInt(el.value)),
          };
        }
      } else if (SOLICITACAO_DATA.EstadoFluxo == "Aprovação Gestor") {
        body["EstadoFluxo"] = approved ? "Aprovado" : "Rejeitado Gestor";
        body["DataRespostaGestor"] = new Date().toISOString();
      }
      await postItem(
        "",
        LISTA.SolicitacaoAcesso,
        await getDigest(),
        body,
        SOLICITACAO_DATA.Id
      )
        .then((result) => {
          console.log(result);
          alert("Sucesso! Informação registrada com sucesso.");
        })
        .catch((error) => {
          alert("Erro! Desculpe, não foi possível concluir o registro");
          console.error("Falha ao atualizar o item na lista.", error);
        })
        .finally((_) => exitRequest());
    }
  }
  