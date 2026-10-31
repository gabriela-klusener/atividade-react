import { useEffect, useState } from "react";

// DADOS DOS FORMULÁRIOS
const forms = [
  {
    id: "pessoal",
    title: "Dados pessoais",
    description: "Informações pessoais e contato.",
    icon: "👤",
    fields: [
      { name: "nome", label: "Nome completo", required: true },
      { name: "email", label: "E-mail", type: "email", required: true },
      { name: "telefone", label: "Telefone", required: true },
      { name: "nascimento", label: "Data de nascimento", type: "date", required: true }
    ]
  },
  {
    id: "profissional",
    title: "Dados profissionais",
    description: "Sua formação e experiência.",
    icon: "💼",
    fields: [
      { name: "ocupacao", label: "Ocupação atual", required: true },
      { name: "formacao", label: "Formação acadêmica", required: true },
      { name: "experiencia", label: "Experiência profissional", required: true },
      { name: "linkedin", label: "LinkedIn (opcional)" }
    ]
  },
  {
    id: "endereco",
    title: "Endereço",
    description: "Informações sobre seu endereço.",
    icon: "📍",
    fields: [
      { name: "cep", label: "CEP", required: true },
      { name: "rua", label: "Rua / Avenida", required: true },
      { name: "numero", label: "Número", required: true },
      { name: "cidade", label: "Cidade", required: true },
      { name: "estado", label: "Estado", required: true }
    ]
  }
];

// COMPONENTE 1: ACORDEÃO
function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="faq">
      <h2>Perguntas frequentes</h2>
      <p className="subtitle">Tire suas dúvidas sobre os formulários.</p>

      {items.map((item, index) => (
        <div className="accordion-item" key={index}>
          <button
            className="accordion-button"
            onClick={() =>
              setOpenIndex(openIndex === index ? null : index)
            }
            aria-expanded={openIndex === index}
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

// COMPONENTE 2: PAGINAÇÃO
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
            aria-current={currentPage === index ? "page" : undefined}
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

// COMPONENTE 3: BARRA DE PROGRESSO
function ProgressBar({ value }) {
  return (
    <div className="progress-area">
      <div className="progress-label">
        <span>Progresso do formulário</span>
        <strong>{value}%</strong>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div
          className="progress-fill"
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}

// COMPONENTE 4: ABAS
function Tabs({ forms, currentId, onSelect }) {
  return (
    <div className="tabs" role="tablist">
      {forms.map((form) => (
        <button
          key={form.id}
          role="tab"
          aria-selected={currentId === form.id}
          className={currentId === form.id ? "tab active" : "tab"}
          onClick={() => onSelect(form.id)}
        >
          {form.icon} {form.title}
        </button>
      ))}
    </div>
  );
}

// COMPONENTE 5: MENU SUSPENSO
function Dropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const options = [
    "Eu mesmo(a)",
    "Outra pessoa",
    "Ambos"
  ];

  return (
    <div className="dropdown">
      <label>Quem está preenchendo?</label>

      <button
        className="dropdown-button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {value} <span>⌄</span>
      </button>

      {open && (
        <div className="dropdown-options">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
              {value === option ? " ✓" : ""}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// COMPONENTE 6: NOTIFICAÇÃO TOAST
function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div
      className={`toast ${toast.type}`}
      role="status"
      aria-live="polite"
    >
      <span>
        {toast.type === "success" ? "✓" : "!"}
      </span>

      {toast.message}

      <button onClick={onClose} aria-label="Fechar notificação">
        ×
      </button>
    </div>
  );
}

// PERGUNTAS DO ACORDEÃO
const faqItems = [
  {
    question: "Minhas respostas ficam salvas?",
    answer:
      "Sim! As respostas são salvas automaticamente no navegador utilizado."
  },
  {
    question: "Posso alterar uma resposta depois?",
    answer:
      "Sim. Basta abrir novamente o formulário e modificar as informações."
  },
  {
    question: "Como sei que terminei um formulário?",
    answer:
      "A barra de progresso mostra a porcentagem preenchida. Para concluir, todos os campos obrigatórios precisam estar preenchidos."
  },
  {
    question: "O que acontece quando clico em Início?",
    answer:
      "Você retorna à página inicial. Suas respostas continuam salvas."
  }
];

// COMPONENTE PRINCIPAL
export default function App() {

  // CARREGAMENTO DOS DADOS SALVOS
  const [savedData, setSavedData] = useState(() => {
    try {
      const stored = localStorage.getItem("formly-data");

      return stored
        ? JSON.parse(stored)
        : {
            respostas: {},
            responsavel: "Eu mesmo(a)",
            concluidos: []
          };
    } catch {
      return {
        respostas: {},
        responsavel: "Eu mesmo(a)",
        concluidos: []
      };
    }
  });

  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);

  const currentForm = forms[currentFormIndex];

  const currentAnswers =
    savedData.respostas[currentForm.id] || {};

  // SALVAR AUTOMATICAMENTE
  useEffect(() => {
    localStorage.setItem(
      "formly-data",
      JSON.stringify(savedData)
    );
  }, [savedData]);

  // FECHAR TOAST AUTOMATICAMENTE
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [toast]);

  // ATUALIZAR RESPOSTAS
  function updateAnswer(fieldName, value) {
    setSavedData((previous) => ({
      ...previous,
      respostas: {
        ...previous.respostas,
        [currentForm.id]: {
          ...(previous.respostas[currentForm.id] || {}),
          [fieldName]: value
        }
      }
    }));
  }

  // CALCULAR PROGRESSO
  function getProgress(form) {
    const answers = savedData.respostas[form.id] || {};

    const requiredFields = form.fields.filter(
      (field) => field.required
    );

    const filledFields = requiredFields.filter(
      (field) =>
        String(answers[field.name] || "").trim() !== ""
    );

    return Math.round(
      (filledFields.length / requiredFields.length) * 100
    );
  }

  // ABRIR FORMULÁRIO
  function openForm(index) {
    setCurrentFormIndex(index);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // NAVEGAR ENTRE FORMULÁRIOS
  function goToForm(index) {
    if (index < 0 || index >= forms.length) return;

    setCurrentFormIndex(index);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // CONCLUIR FORMULÁRIO
  function finishForm() {
    const missing = currentForm.fields.some(
      (field) =>
        field.required &&
        !String(currentAnswers[field.name] || "").trim()
    );

    if (missing) {
      setToast({
        type: "error",
        message: "Preencha todos os campos obrigatórios!"
      });

      return;
    }

    setSavedData((previous) => ({
      ...previous,
      concluidos: previous.concluidos.includes(currentForm.id)
        ? previous.concluidos
        : [...previous.concluidos, currentForm.id]
    }));

    setToast({
      type: "success",
      message: "Formulário concluído com sucesso!"
    });
  }

  // VOLTAR PARA A PÁGINA INICIAL
  function goHome() {
    setShowForm(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const allCompleted = forms.every((form) =>
    savedData.concluidos.includes(form.id)
  );

  return (
    <div className="app">

      {/* CABEÇALHO */}
      <header className="header">
        <button className="logo" onClick={goHome}>
          <span>F</span> formly
        </button>

        <button className="home-button" onClick={goHome}>
          ⌂ Início
        </button>
      </header>

      <main className="container">

        {!showForm ? (

          // PÁGINA INICIAL
          <>
            <section className="hero">
              <span className="eyebrow">
                ORGANIZE SUAS INFORMAÇÕES
              </span>

              <h1>
                Seus formulários,
                <br />
                <span>em um só lugar.</span>
              </h1>

              <p>
                Preencha, acompanhe seu progresso e mantenha
                suas informações organizadas.
              </p>

              <div className="notice">
                ✦ Suas respostas são salvas automaticamente.
              </div>
            </section>

            <section className="forms-section">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">
                    ÁREA DE PREENCHIMENTO
                  </span>

                  <h2>Escolha um formulário</h2>

                  <p>
                    Selecione um dos formulários abaixo para começar.
                  </p>
                </div>

                <span className="form-count">
                  {savedData.concluidos.length} de {forms.length} concluídos
                </span>
              </div>

              <div className="form-cards">
                {forms.map((form, index) => (
                  <button
                    className="form-card"
                    key={form.id}
                    onClick={() => openForm(index)}
                  >
                    <span className="card-icon">{form.icon}</span>

                    <h3>{form.title}</h3>

                    <p>{form.description}</p>

                    <div className="mini-progress">
                      <div
                        style={{
                          width: `${getProgress(form)}%`
                        }}
                      ></div>
                    </div>

                    <span className="card-percentage">
                      {getProgress(form)}% preenchido
                    </span>

                    <span className="card-link">
                      Abrir formulário →
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {allCompleted && (
              <div className="completion-banner">
                ✓ Todos os formulários foram concluídos!
              </div>
            )}

            <Accordion items={faqItems} />
          </>

        ) : (

          // ÁREA DOS FORMULÁRIOS
          <section className="workspace">

            <button className="back-link" onClick={goHome}>
              ← Voltar para início
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
              onSelect={(id) =>
                goToForm(
                  forms.findIndex((form) => form.id === id)
                )
              }
            />

            <div className="form-panel">

              <div className="panel-heading">
                <div>
                  <span className="step-label">
                    FORMULÁRIO {currentFormIndex + 1} DE {forms.length}
                  </span>

                  <h2>{currentForm.title}</h2>
                </div>

                {savedData.concluidos.includes(currentForm.id) && (
                  <span className="completed-label">
                    ✓ Concluído
                  </span>
                )}
              </div>

              {/* BARRA DE PROGRESSO */}
              <ProgressBar value={getProgress(currentForm)} />

              {/* MENU SUSPENSO */}
              <Dropdown
                value={savedData.responsavel}
                onChange={(value) =>
                  setSavedData((previous) => ({
                    ...previous,
                    responsavel: value
                  }))
                }
              />

              {/* CAMPOS DO FORMULÁRIO */}
              <div className="fields-grid">
                {currentForm.fields.map((field) => (
                  <label className="form-field" key={field.name}>
                    <span>
                      {field.label}

                      {field.required && (
                        <strong className="required"> *</strong>
                      )}
                    </span>

                    <input
                      type={field.type || "text"}
                      value={currentAnswers[field.name] || ""}
                      onChange={(event) =>
                        updateAnswer(
                          field.name,
                          event.target.value
                        )
                      }
                      placeholder={`Digite ${field.label.toLowerCase()}`}
                    />
                  </label>
                ))}
              </div>

              <p className="required-note">
                * Campos obrigatórios
              </p>

              <div className="form-actions">
                <button
                  className="secondary-button"
                  onClick={goHome}
                >
                  Salvar e sair
                </button>

                <button
                  className="primary-button"
                  onClick={finishForm}
                >
                  Concluir formulário ✓
                </button>
              </div>
            </div>

            {/* PAGINAÇÃO */}
            <Pagination
              currentPage={currentFormIndex}
              totalPages={forms.length}
              onPageChange={goToForm}
            />

          </section>
        )}

      </main>

      {/* RODAPÉ */}
      <footer className="footer">
        <strong>F formly</strong>
        <span>Organização simples para suas informações.</span>
      </footer>

      {/* NOTIFICAÇÃO TOAST */}
      <Toast
        toast={toast}
        onClose={() => setToast(null)}
      />

    </div>
  );
}