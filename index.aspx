<!DOCTYPE html>

    <html lang="pt-br" xmlns:mso="urn:schemas-microsoft-com:office:office"
      xmlns:msdt="uuid:C2F41010-65B3-11d1-A29F-00AA00C14882">

    <head>
<meta charset="utf-8" />
      <meta http-equiv="Content-type" content="text/html; charset=UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Solicitação de Acesso Docnix</title>
      <link rel="shortcut icon" href="/siteassets/img/favicon.ico" id="favicon" />
      <link href="https://pagecdn.io/lib/normalize/8.0.1/normalize.min.css" rel="stylesheet" crossorigin="anonymous" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        crossorigin="anonymous" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">

      <link rel="stylesheet" href="style.css" />

      <!--[if gte mso 9]>
      <!
    [endif]-->
    </head>

    <body>
      <header>
        <img src="/SiteAssets/Logo%20Hypera.png" alt="Hypera Pharma" height="60px" width="auto" />
      </header>
      <nav>
        <a href="https://suporteprd.service-now.com/hyperapharma?id=index">Página Inicial</a>
        <i class="fa fa-chevron-right"></i>
        <a href="https://suporteprd.service-now.com/hyperapharma?id=sc_category">Solicitação</a>
        <i class="fa fa-chevron-right"></i>
        <a
          href="https://suporteprd.service-now.com/hyperapharma?id=sc_category&sys_id=e6dc7bd2db996b403d36980c8a96190c">Acessos</a>
        <i class="fa fa-chevron-right"></i>
        <span>Docnix</span>
      </nav>
      <main>
        <form action="" autocomplete="off" id="myForm">
          <section class="fields">
            <div class="infor">
              <h1>Acessos Docnix</h1>
              <span>Solicitação de liberação, alteração e revogação de acesso a
                ferramenta.</span>
              <span id="EstadoFluxo">Novo</span>
            </div>

            <div class="flex flex-row">
              <div class="form-field">
                <label for="solicitanteNome" class="form-label">Solicitante</label>
                <input id="solicitanteNome" name="solicitanteNome" class="form-control" type="text"
                  placeholder="Nome do usuário que solicitou o acesso" readonly />
              </div>
              <div class="form-field">
                <label for="solicitanteEmail" class="form-label">E-mail</label>
                <input id="solicitanteEmail" name="solicitanteEmail" class="form-control" type="text"
                  placeholder="E-mail que solicitou o acesso" readonly />
              </div>
            </div>
            <br />
            <div class="flex flex-row">
              <div class="form-field">
                <label for="usuarioAfetadoNome" class="form-label">Usuário Afetado <span style="color: red" title="Campo obrigatório.">*</span></label>
                <input id="usuarioAfetadoNome" name="user-lookup" class="form-control" type="text"
                  placeholder="Digite nome ou e-mail do usuário" list="list-users-to" required readonly />
                <datalist id="list-users-to"> </datalist>
              </div>
              <div class="form-field">
                <label for="usuarioAfetadoEmail" class="form-label">E-mail</label>
                <input id="usuarioAfetadoEmail" name="usuarioAfetadoEmail" class="form-control" type="text"
                  placeholder="E-mail do usuário afetado" required readonly />
              </div>
              <div class="form-field hidden">
                <label for="usuarioAfetadoId" class="form-label">Id</label>
                <input id="usuarioAfetadoId" name="usuarioAfetadoId" class="form-control" type="hidden"
                  placeholder="ID do usuário afetado" required readonly />
              </div>
            </div>
            <br />
            <hr />
            <div class="flex flex-row">
              <div class="flex flex-col">
                <div class="form-field">
                  <label for="localidade">Localidade <span style="color: red" title="Campo obrigatório.">*</span></label>
                  <select id="localidade" name="localidade" class="form-control" required readonly>
                    <option value="" disabled selected>Locais</option>
                    <option value="Anápolis/Brainfarma">
                      Anápolis/Brainfarma
                    </option>
                    <option value="SP/Hynova">SP/Hynova</option>
                    <option value="Softtek">Softtek</option>
                  </select>
                </div>
              </div>
              <div class="flex flex-col">
                <div class="form-field">
                  <label for="tipoSolicitacao">Tipo de Solicitação <span style="color: red" title="Campo obrigatório.">*</span></label>
                  <select name="tipoSolicitacao" id="tipoSolicitacao" class="form-control" required readonly>
                    <option value="" selected>
                      Selecione um tipo de solicitação
                    </option>
                    <option value="Liberação">Liberação</option>
                    <option value="Alteração">Alteração</option>
                    <option value="Revogação">Revogação</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="flex flex-row">
              <div class="form-field">
                <label for="usuarioEspelhoNome"  class="form-label">Usuário Espelho</label>
                <input id="usuarioEspelhoNome" name="user-lookup" class="form-control" type="text"
                  placeholder="Digite nome ou e-mail do usuário" list="list-users-from" readonly />
                <datalist id="list-users-from"> </datalist>
              </div>
              <div class="form-field">
                <label for="usuarioEspelhoEmail" class="form-label">E-mail</label>
                <input id="usuarioEspelhoEmail" name="usuarioEspelhoEmail" class="form-control" type="text"
                  placeholder="E-mail do usuário espelho" readonly />
              </div>
              <div class="form-field hidden">
                <label for="usuarioEspelhoId" class="form-label">Id</label>
                <input id="usuarioEspelhoId" name="usuarioEspelhoId" class="form-control" type="hidden"
                  placeholder="ID do usuário espelho" readonly />
              </div>
            </div>
            
            <div class="flex flex-row">
                <div class="form-field">
                  <label for="atribuicoes" class="form-label">Atribuições do usuário (<span>0</span>)</label>
                  <select name="atribuicoes" id="atribuicoes" class="form-control" multiple readonly></select>
                </div>
                <div class="form-field">
                  <label for="grupos" class="form-label">Grupos do usuário (<span>0</span>)</label>
                  <select name="grupos" id="grupos" class="form-control" multiple readonly></select>
                </div>
              </div>
              <div class="flex flex-row">
                <div class="form-field">
                  <label for="justify" class="form-label">Justificativa <span style="color: red" title="Campo obrigatório.">*</span></label>
                  <textarea name="justify" id="justificativa" rows="3" class="form-control" required readonly></textarea>
                </div>
              </div>
            <hr />
            <div id="secKeyuser" class="flex flex-col">
              <div class="flex flex-row">
                <div class="form-field">
                  <label for="justify" class="form-label">Justificativa do KeyUser</label>
                  <textarea name="justify" id="justificativaKeyUser" rows="3" class="form-control" readonly></textarea>
                </div>
              </div>
              <div class="flex flex-row">
                <div class="form-field">
                  <label for="usuarioChaveNome" class="form-label">Usuário-chave</label>
                  <input id="usuarioChaveNome" name="usuarioChaveNome" class="form-control" type="text"
                    placeholder="Usuário-chave aprovador" readonly  />
                </div>
                <div class="form-field">
                  <label for="usuarioChaveEmail" class="form-label">E-mail</label>
                  <input id="usuarioChaveEmail" name="usuarioChaveEmail" class="form-control" type="text"
                    placeholder="E-mail do usuário-chave" readonly  />
                </div>
                <div class="form-field hidden">
                  <label for="usuarioChaveId" class="form-label ">Id</label>
                  <input id="usuarioChaveId" name="usuarioChaveId" class="form-control" type=""
                    placeholder="ID do usuário-chave" readonly />
                </div>
                <div class="form-field">
                  <label for="usuarioChaveDataAprovacao" class="form-label">Data de aprovação</label>
                  <input id="usuarioChaveDataAprovacao" name="usuarioChaveDataAprovacao" class="form-control"
                    type="datetime-local" placeholder="Data de aprovação" readonly />
                </div>
              </div>
            </div>

            <div id="secGestor" class="flex flex-col">
              <div class="flex flex-row">
                <div class="form-field">
                  <label for="usuarioGestorNome" class="form-label">Gestor do usuário</label>
                  <input id="usuarioGestorNome" name="usuarioGestorNome" class="form-control" type="text"
                    placeholder="Gestor do usuário afetado" readonly  />
                </div>
                <div class="form-field">
                  <label for="usuarioGestorEmail" class="form-label">E-mail</label>
                  <input id="usuarioGestorEmail" name="usuarioGestorEmail" class="form-control" type="text"
                    placeholder="E-mail do gestor do usuário afetado" readonly  />
                </div>
                <div class="form-field hidden">
                  <label for="usuarioGestorId" class="form-label">Id</label>
                  <input id="usuarioGestorId" name="usuarioGestorId" class="form-control" type="hidden"
                    placeholder="ID do gestor do usuário afetado" readonly />
                </div>
                <div class="form-field">
                  <label for="usuarioGestorDataAprovacao" class="form-label">Data de aprovação</label>
                  <input id="usuarioGestorDataAprovacao" name="usuarioGestorDataAprovacao" class="form-control"
                    type="datetime-local" placeholder="Data de aprovação" readonly />
                </div>
              </div>
            </div>

            <br />
            <div class="card-footer text-muted flex flex-col">
              <div class="row">
                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                  <div id="btnRequesterActions" class="row text-center">
                    <button id="btnCancel" type="button" class="col btn btn-block text-uppercase btn-outline-danger m-1" hidden>
                      <span class="fas fa-arrow-alt-circle-left"></span>
                      Cancelar
                    </button>
                    <button id="btnSave" type="button" class="col btn btn-block text-uppercase btn-success m-1" hidden>
                      Salvar e Solicitar Aprovação
                      <span class="fas fa-arrow-alt-circle-right"></span>
                    </button>
                    <button id="btnDisapprove" type="button" class="col btn btn-block text-uppercase btn-outline-danger m-1" hidden>
                      <span class="fas fa-arrow-alt-circle-left"></span>
                      Reprovar
                    </button>
                    <button id="btnApprove" type="button" class="col btn btn-block text-uppercase btn-success m-1" hidden>
                      Aprovar
                      <span class="fas fa-arrow-alt-circle-right"></span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </form>
      </main>
      <footer>
        <span>Asalesg Hehehe 2024</span>
      </footer>
    </body>
    <script src="/SiteAssets/SPUtils.js" charset="utf-8"></script>
    <script src="script.js" charset="utf-8"></script>

    </html>
