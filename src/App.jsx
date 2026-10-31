
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// DADOS DOS FORMULÁRIOS
const forms = [
  {
    id: "pessoal",
    title: "Informações pessoais",
    description: "Preencha seus dados pessoais.",
    fields: [
      { name: "nome", label: "Nome completo", type: "text", required: true },
      { name: "email", label: "E-mail", type: "email", required: true },
      { name: "telefone", label: "Telefone", type: "tel", required: true },
      { name: "nascimento", label: "Data de nascimento", type: "date", required: true }
    ]
  },
  {
    id: "profissional",
    title: "Informações profissionais",
    description: "Conte um pouco sobre sua vida profissional.",
    fields: [
      { name: "profissao", label: "Profissão", type: "text", required: true },
      { name: "empresa", label: "Empresa", type: "text", required: true },
      { name: "cargo", label: "Cargo", type: "text", required: true },
      { name: "experiencia", label: "Tempo de experiência", type: "text", required: true },
      { name: "linkedin", label: "LinkedIn", type: "url", required: false }
    ]
  },
  {
    id: "endereco",
    title: "Informações de endereço",
    description: "Informe seu endereço atual.",
    fields: [
      { name: "cep", label: "CEP", type: "text", required: true },
      { name: "rua", label: "Rua", type: "text", required: true },
      { name: "numero", label: "Número", type: "text", required: true },
      { name: "bairro", label: "Bairro", type: "text", required: true },
      { name: "cidade", label: "Cidade", type: "text", required: true },
      { name: "estado", label: "Estado", type: "text", required: true }
    ]
  }
];

// PERGUNTAS FREQUENTES
const faqItems = [
  {
    question: "Como preencher os formulários?",
    answer: "Na página inicial, escolha um formulário e preencha os campos solicitados."
  },
  {
    question: "Posso alterar minhas respostas?",
    answer: "Sim! Você pode voltar a qualquer formulário e modificar suas respostas."
  },
  {
    question: "Minhas informações ficam salvas?",
    answer: "Sim! As respostas ficam salvas no armazenamento local do navegador."
  },
  {
    question: "Como sei que terminei um formulário?",
    answer: "Uma mensagem de confirmação será exibida quando todos os campos obrigatórios forem preenchidos."
  }
];

// BARRA DE PROGRESSO
function ProgressBar({ value }) {
  return (
    <div className="progress-area">
      <div className="progress-label">
        <span>Progresso do formulário</span>
        <strong>{value}%</strong>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

// ACORDEÃO
function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faq">
      <h2>Perguntas frequentes</h2>
      <p className="subtitle">
        Confira algumas dúvidas sobre o funcionamento da plataforma.
      </p>

      {items.map((item, index) => (
        <div className="accordion-item" key={index}>
          <button
            className="accordion-button"
            onClick={() =>
              setOpenIndex(openIndex === index ? null : index)
            }
          >
            {item.question}
            <span>{openIndex === index ? "−" : "+"}</span>
          </button>

          {openIndex === index && (
            <div className="accordion-content">
              {item.answer}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

// ABAS
function Tabs({ forms, currentId, onSelect }) {
  return (
    <div className="tabs">
      {forms.map((form) => (
        <button
          key={form.id}
          className={currentId === form.id ? "tab active" : "tab"}
          onClick={() => onSelect(form.id)}
        >
          {form.title}
        </button>
      ))}
    </div>
  );
}

// MENU SUSPENSO
function Dropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const options = ["Eu mesmo", "Outra pessoa", "Ambos"];

  return (
    <div className="dropdown">
      <label>Quem está preenchendo este formulário?</label>

      <button
        type="button"
        className="dropdown-button"
        onClick={() => setOpen(!open)}
      >
        {value || "Selecione uma opção"}
        <span>{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="dropdown-options">
          {options.map((option) => (
            <button
              type="button"
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// PAGINAÇÃO
function Pagination({ currentPage, totalPages, onPageChange }) {
  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        ← Anterior
      </button>

      <div className="page-numbers">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index ? "active" : ""}
            onClick={() => onPageChange(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
      >
        Próximo →
      </button>
    </div>
  );
}

// NOTIFICAÇÃO
function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className={`toast ${toast.type}`}>
      <span>{toast.message}</span>
      <button onClick={onClose}>×</button>
    </div>
  );
}

// APLICAÇÃO PRINCIPAL
function App() {
  const navigate = useNavigate();
  const { formId } = useParams();

  const [savedData, setSavedData] = useState(() => {
    try {
      const data = localStorage.getItem("formly-data");

      return data
        ? JSON.parse(data)
        : {
            answers: {},
            completed: {},
            responsaveis: {}
          };
    } catch {
      return {
        answers: {},
        completed: {},
        responsaveis: {}
      };
    }
  });

  const [toast, setToast] = useState(null);

  const currentFormIndex = forms.findIndex(
    (form) => form.id === formId
  );

  const showForm = Boolean(formId);

  const currentForm = forms[currentFormIndex];

  // VERIFICA A URL
  useEffect(() => {
    if (formId && currentFormIndex === -1) {
      navigate("/", { replace: true });
    }
  }, [formId, currentFormIndex, navigate]);

  // SALVA OS DADOS NO NAVEGADOR
  useEffect(() => {
    localStorage.setItem("formly-data", JSON.stringify(savedData));
  }, [savedData]);

  // FECHA A NOTIFICAÇÃO AUTOMATICAMENTE
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast]);

  // CALCULA O PROGRESSO
  function getProgress(form) {
    const answers = savedData.answers[form.id] || {};

    const requiredFields = form.fields.filter(
      (field) => field.required
    );

    if (requiredFields.length === 0) return 100;

    const filledFields = requiredFields.filter(
      (field) => String(answers[field.name] || "").trim() !== ""
    );

    return Math.round(
      (filledFields.length / requiredFields.length) * 100
    );
  }

  // NAVEGAÇÃO
  function openForm(index) {
    navigate(`/formulario/${forms[index].id}`);
  }

  function goToForm(index) {
    if (index < 0 || index >= forms.length) return;

    navigate(`/formulario/${forms[index].id}`);
  }

  function goHome() {
    navigate("/");
  }

  // RESPOSTAS DO FORMULÁRIO ATUAL
  const currentAnswers = currentForm
    ? savedData.answers[currentForm.id] || {}
    : {};

  // ATUALIZA OS CAMPOS
  function handleChange(fieldName, value) {
    setSavedData((previous) => ({
      ...previous,

      answers: {
        ...previous.answers,
        [currentForm.id]: {
          ...(previous.answers[currentForm.id] || {}),
          [fieldName]: value
        }
      },

      completed: {
        ...previous.completed,
        [currentForm.id]: false
      }
    }));
  }

  // ATUALIZA QUEM ESTÁ PREENCHENDO
  function handleResponsavel(value) {
    setSavedData((previous) => ({
      ...previous,

      responsaveis: {
        ...previous.responsaveis,
        [currentForm.id]: value
      }
    }));
  }

  // CONCLUI O FORMULÁRIO
  function handleComplete(event) {
    event.preventDefault();

    const missingFields = currentForm.fields.filter(
      (field) =>
        field.required &&
        !String(currentAnswers[field.name] || "").trim()
    );

    if (missingFields.length > 0) {
      setToast({
        type: "error",
        message: "Preencha todos os campos obrigatórios antes de concluir."
      });

      return;
    }

    setSavedData((previous) => ({
      ...previous,

      completed: {
        ...previous.completed,
        [currentForm.id]: true
      }
    }));

    setToast({
      type: "success",
      message: "Formulário concluído com sucesso!"
    });
  }

  return (
    <div className="app">

      {/* CABEÇALHO */}
      <header className="header">
        <button className="logo" onClick={goHome}>
          Formly
        </button>

        {showForm && (
          <button className="home-button" onClick={goHome}>
            ← Voltar ao início
          </button>
        )}
      </header>

      <main className="container">

        {!showForm ? (
          <>
            {/* PÁGINA INICIAL */}
            <section className="hero">
              <span className="eyebrow">
                ORGANIZE SUAS INFORMAÇÕES
              </span>

              <h1>
                Bem-vindo ao <span>Formly!</span>
              </h1>

              <p>
                Organize suas informações preenchendo os formulários
                disponíveis abaixo.
              </p>

              <div className="notice">
                Suas respostas ficam salvas automaticamente no navegador.
              </div>
            </section>

            <section className="forms-section">

              <div className="section-heading">
                <div>
                  <h2>Meus formulários</h2>
                  <p>Escolha um formulário para começar.</p>
                </div>

                <span className="form-count">
                  {forms.length} formulários disponíveis
                </span>
              </div>

              {forms.every((form) => savedData.completed[form.id]) && (
                <div className="completion-banner">
                  Parabéns! Você concluiu todos os formulários.
                </div>
              )}

              <div className="form-cards">
                {forms.map((form, index) => (
                  <button
                    className="form-card"
                    key={form.id}
                    onClick={() => openForm(index)}
                  >
                    <span className="card-icon">
                      {form.icon}
                    </span>

                    <h3>{form.title}</h3>

                    <p>{form.description}</p>

                    <div className="mini-progress">
                      <div
                        style={{
                          width: `${getProgress(form)}%`
                        }}
                      />
                    </div>

                    <span className="card-percentage">
                      {getProgress(form)}% preenchido
                    </span>

                    <span className="card-link">
                      {savedData.completed[form.id]
                        ? "✓ Formulário concluído"
                        : "Acessar formulário →"}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <Accordion items={faqItems} />
          </>
        ) : (
          currentForm && (
            <>
              {/* ÁREA DOS FORMULÁRIOS */}
              <section className="workspace">

                <button className="back-link" onClick={goHome}>
                  ← Voltar para a página inicial
                </button>

                <div className="workspace-heading">
                  <span className="eyebrow">
                    PREENCHIMENTO DE FORMULÁRIO
                  </span>

                  <h1>{currentForm.title}</h1>

                  <p>{currentForm.description}</p>
                </div>

                {/* ABAS */}
                <Tabs
                  forms={forms}
                  currentId={currentForm.id}
                  onSelect={(id) => {
                    const index = forms.findIndex(
                      (form) => form.id === id
                    );

                    goToForm(index);
                  }}
                />

                {/* PAINEL */}
                <section className="form-panel">

                  <div className="panel-heading">
                    <div>
                      <span className="step-label">
                        ETAPA {currentFormIndex + 1} DE {forms.length}
                      </span>

                      <h2>{currentForm.title}</h2>
                    </div>

                    {savedData.completed[currentForm.id] && (
                      <span className="completed-label">
                        ✓ Concluído
                      </span>
                    )}
                  </div>

                  <ProgressBar value={getProgress(currentForm)} />

                  <Dropdown
                    value={
                      savedData.responsaveis[currentForm.id] || ""
                    }
                    onChange={handleResponsavel}
                  />

                  <form onSubmit={handleComplete}>

                    <div className="fields-grid">
                      {currentForm.fields.map((field) => (
                        <label
                          className="form-field"
                          key={field.name}
                        >
                          <span>
                            {field.label}

                            {field.required && (
                              <span className="required"> *</span>
                            )}
                          </span>

                          <input
                            type={field.type}
                            value={currentAnswers[field.name] || ""}
                            onChange={(event) =>
                              handleChange(
                                field.name,
                                event.target.value
                              )
                            }
                            placeholder={
                              field.type === "date"
                                ? undefined
                                : `Digite ${field.label.toLowerCase()}`
                            }
                          />
                        </label>
                      ))}
                    </div>

                    <p className="required-note">
                      * Campos obrigatórios
                    </p>

                    <div className="form-actions">
                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => goToForm(currentFormIndex - 1)}
                        disabled={currentFormIndex === 0}
                      >
                        ← Formulário anterior
                      </button>

                      <button
                        type="submit"
                        className="primary-button"
                      >
                        Concluir formulário
                      </button>

                      <button
                        type="button"
                        className="secondary-button"
                        onClick={() => goToForm(currentFormIndex + 1)}
                        disabled={currentFormIndex === forms.length - 1}
                      >
                        Próximo formulário →
                      </button>
                    </div>

                  </form>
                </section>

                {/* PAGINAÇÃO */}
                <Pagination
                  currentPage={currentFormIndex}
                  totalPages={forms.length}
                  onPageChange={goToForm}
                />

              </section>

              <Accordion items={faqItems} />
            </>
          )
        )}

      </main>

      {/* RODAPÉ */}
      <footer className="footer">
        <p>Formly © 2026 - Organização simples e prática de formulários.</p>
      </footer>

      {/* NOTIFICAÇÕES */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />

    </div>
  );
}

export default App;
