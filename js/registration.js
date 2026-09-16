// ============ Registration checklist data ============
const trackASteps = [
  {
    id: "a1",
    ar: { title: "تأكيد الشكل القانوني للشركة", desc: "شركة محدودة المسؤولية أو مساهمة مغفلة مؤسسة في سورية (يُقبل قيد التأسيس شريطة تزويد السجل التجاري قبل منح الترخيص)، غايتها تقديم خدمة توصيل الطلبات." },
    en: { title: "Confirm Company Legal Structure", desc: "An LLC or joint-stock company established in Syria (a company still being formed is acceptable, provided the commercial register is submitted before the license is granted), with delivery services as its stated purpose." }
  },
  {
    id: "a2",
    ar: { title: "تجهيز الوثائق الأساسية", desc: "سجل تجاري ساري ومصدق أصولاً، أسماء المخولين بالتوقيع ونماذج توقيعهم، ووثائق عدم محكومية وصور هوية لكل الأشخاص المدرجين في السجل التجاري." },
    en: { title: "Prepare Core Documents", desc: "A valid, notarized commercial register; authorized signatories with signature specimens; and criminal-record clearance plus ID copies for everyone listed in the commercial register." }
  },
  {
    id: "a3",
    ar: { title: "تعبئة استمارة طلب الترخيص", desc: "تعبئة استمارة طلب الحصول على الترخيص النمطي وفق النموذج المعتمد من الهيئة الناظمة للاتصالات والبريد." },
    en: { title: "Complete the License Application Form", desc: "Fill out the standard license application form using SyTRA's approved template." }
  },
  {
    id: "a4",
    ar: { title: "تسديد رسم دراسة الطلب", desc: "تسديد إشعار أجر طلب الحصول على الترخيص عند التقديم." },
    en: { title: "Pay the Application Review Fee", desc: "Submit proof of payment for the license application review fee." },
    fee: { ar: "١٠٠,٠٠٠ ل.س", en: "100,000 SYP" }
  },
  {
    id: "a5",
    ar: { title: "إعداد دراسة الجدوى الاقتصادية", desc: "دراسة سوق وتوقعات مالية لثلاث سنوات مقبلة (الموازنة التقديرية، التدفقات النقدية، الأرباح والخسائر) — هذا الملف نفسه." },
    en: { title: "Prepare the Economic Feasibility Study", desc: "A market study and 3-year financial projections (budget, cash flow, P&L) — this is exactly what this workbook and page cover." }
  },
  {
    id: "a6",
    ar: { title: "إعداد التعرفة والمواصفات الفنية", desc: "التعرفة المقترحة (أجور التوصيل وأجور المنصة)، والمواصفات الفنية لمنظومة التطبيق، ومكان الاستضافة المحلي." },
    en: { title: "Prepare Tariff & Technical Specs", desc: "The proposed tariff (delivery fee + platform fee), technical specifications of the system, and local hosting details." }
  },
  {
    id: "a7",
    ar: { title: "إعداد سياسات حماية البيانات والسلامة", desc: "آلية الأرشفة وحفظ البيانات، وإجراءات السلامة العامة والأمنية المتبعة أثناء توصيل الطلبات." },
    en: { title: "Prepare Data Protection & Safety Policies", desc: "Data archiving/retention approach and the security and safety procedures followed during deliveries." }
  },
  {
    id: "a8",
    ar: { title: "الحصول على الموافقة المبدئية وسداد بدل الترخيص الابتدائي", desc: "بعد موافقة الهيئة المبدئية، سداد بدل الترخيص الابتدائي لاستكمال منح الترخيص." },
    en: { title: "Receive Initial Approval & Pay the Initial License Fee", desc: "After SyTRA's preliminary approval, pay the initial license fee to complete the grant of the license." },
    fee: { ar: "٥٠٠,٠٠٠ ل.س", en: "500,000 SYP" }
  },
  {
    id: "a9",
    ar: { title: "الإطلاق التجاري خلال ٦ أشهر", desc: "البدء بتقديم الخدمة تجارياً خلال مدة أقصاها ستة أشهر من تاريخ سريان الترخيص، وإبلاغ الهيئة قبل الإطلاق بشهر على الأقل." },
    en: { title: "Commercial Launch within 6 Months", desc: "Begin commercial service delivery within 6 months of the license effective date, notifying SyTRA at least one month before launch." }
  },
  {
    id: "a10",
    ar: { title: "سداد أجر الترخيص السنوي وتقاسم الإيراد", desc: "سداد الأجر السنوي في بداية كل سنة مالية، وتقاسم الإيراد مع الهيئة وفق الجدول التصاعدي (٠٪ / ٥٪ / ١٠٪ / ١٥٪)." },
    en: { title: "Pay Annual License Fee & Revenue Share", desc: "Pay the annual fee at the start of each fiscal year, and share revenue with SyTRA per the rising schedule (0% / 5% / 10% / 15%)." },
    fee: { ar: "٥٠٠,٠٠٠ ل.س / سنوياً", en: "500,000 SYP / year" }
  }
];

const trackBSteps = [
  {
    id: "b1",
    ar: { title: "تعبئة استمارة طلب الاعتمادية", desc: "تعبئة استمارة طلب الحصول على اعتمادية تطبيق إلكتروني وفق النموذج المعتمد." },
    en: { title: "Complete the Accreditation Application", desc: "Fill out the electronic app accreditation application using the approved form." }
  },
  {
    id: "b2",
    ar: { title: "توثيق فريق العمل والملكية", desc: "قائمة بأسماء ومؤهلات ومعلومات تواصل مالك التطبيق، المدير التنفيذي، المطور، مسؤول قواعد البيانات، ومسؤول حماية البيانات." },
    en: { title: "Document the Team & Ownership", desc: "Names, qualifications, and contact info for the app owner, CEO, developer, database admin, and data protection officer." }
  },
  {
    id: "b3",
    ar: { title: "تجهيز نسخة فعالة من التطبيق", desc: "نسخة نهائية وفعالة (جميع الوظائف مفعّلة) من التطبيق، مع توصيف آلية عمله والربط البرمجي." },
    en: { title: "Prepare a Working App Version", desc: "A final, fully-functional copy of the app, with a description of how it operates and its technical integration." }
  },
  {
    id: "b4",
    ar: { title: "صياغة سياسة الخصوصية وشروط الاستخدام", desc: "بالعربية والإنكليزية، تتضمن حقوق المستخدم ومسؤولياته وسياسة القاصرين وإجراءات مخالفة الاستخدام." },
    en: { title: "Draft Privacy Policy & Terms of Use", desc: "In Arabic and English, covering user rights/responsibilities, a minors' policy, and violation procedures." }
  },
  {
    id: "b5",
    ar: { title: "اجتياز اختبار أمن المعلومات", desc: "الحصول على وثيقة اجتياز اختبارات المسح الأمني والاختراق موقعة من مركز أمن المعلومات أو شركة معتمدة." },
    en: { title: "Pass the Information Security Test", desc: "Obtain a signed penetration/vulnerability test certificate from the Information Security Center or an accredited firm." }
  },
  {
    id: "b6",
    ar: { title: "توقيع التعهدات المطلوبة", desc: "تعهد الالتزام بضوابط التطبيقات الإلكترونية، وتعهد الالتزام بسياسة أمن المعلومات الوطنية، واستخدام شهادة SSL بشكل دائم." },
    en: { title: "Sign the Required Pledges", desc: "Pledges to comply with e-app regulations, to follow the national information-security policy, and to use SSL permanently." }
  },
  {
    id: "b7",
    ar: { title: "تقديم الطلب للمراجعة والحصول على الاعتمادية", desc: "تقديم كامل الملف للجهة المختصة ومتابعة الرد خلال فترة الاختبارات الفنية." },
    en: { title: "Submit for Review & Receive Accreditation", desc: "Submit the complete file to the relevant authority and follow up during the technical testing period." }
  }
];

const STORAGE_KEY = "regProgress_v1";

function loadProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (e) {
    return {};
  }
}

function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function renderTrack(containerId, steps, trackLetter) {
  const container = document.getElementById(containerId);
  const progress = loadProgress();
  container.innerHTML = "";

  steps.forEach((step, idx) => {
    const state = progress[step.id] || { done: false, date: "" };
    const content = step[currentLang] || step.ar;
    const li = document.createElement("li");
    li.className = "step-item" + (state.done ? " done" : "");
    li.dataset.stepId = step.id;

    const feeHtml = step.fee
      ? `<span class="step-fee">${t("fee")}: ${step.fee[currentLang] || step.fee.ar}</span>`
      : "";

    li.innerHTML = `
      <button class="step-checkbox" type="button" aria-label="toggle done">${state.done ? "✓" : ""}</button>
      <div class="step-body">
        <p class="step-title">${idx + 1}. ${content.title}</p>
        <p class="step-desc">${content.desc}${feeHtml}</p>
        <div class="step-meta">
          <label class="step-date-label">${t("dateLabel")}</label>
          <input type="date" class="step-date" value="${state.date || ""}" ${state.done ? "" : ""}>
          ${state.done && state.date ? `<span class="done-badge">${t("doneOn")} ${state.date}</span>` : ""}
        </div>
      </div>
    `;

    const checkbox = li.querySelector(".step-checkbox");
    const dateInput = li.querySelector(".step-date");

    checkbox.addEventListener("click", () => {
      const p = loadProgress();
      const cur = p[step.id] || { done: false, date: "" };
      cur.done = !cur.done;
      if (cur.done && !cur.date) cur.date = todayISO();
      p[step.id] = cur;
      saveProgress(p);
      renderTrack(containerId, steps, trackLetter);
      updateProgressBars();
    });

    dateInput.addEventListener("change", (e) => {
      const p = loadProgress();
      const cur = p[step.id] || { done: false, date: "" };
      cur.date = e.target.value;
      p[step.id] = cur;
      saveProgress(p);
      renderTrack(containerId, steps, trackLetter);
    });

    container.appendChild(li);
  });
}

function updateProgressBars() {
  const progress = loadProgress();

  function countDone(steps) {
    return steps.filter(s => progress[s.id] && progress[s.id].done).length;
  }

  const doneA = countDone(trackASteps);
  const doneB = countDone(trackBSteps);
  const totalA = trackASteps.length;
  const totalB = trackBSteps.length;

  document.querySelector('[data-track-bar="A"]').style.width = (doneA / totalA * 100) + "%";
  document.querySelector('[data-track-text="A"]').textContent = `${doneA} / ${totalA}`;
  document.querySelector('[data-track-bar="B"]').style.width = (doneB / totalB * 100) + "%";
  document.querySelector('[data-track-text="B"]').textContent = `${doneB} / ${totalB}`;

  const totalDone = doneA + doneB;
  const totalAll = totalA + totalB;
  document.getElementById("overallProgressBar").style.width = (totalDone / totalAll * 100) + "%";
  document.getElementById("overallProgressText").textContent = `${totalDone} / ${totalAll}`;
}

function renderRegistration() {
  renderTrack("trackA", trackASteps, "A");
  renderTrack("trackB", trackBSteps, "B");
  updateProgressBars();
}

document.addEventListener("DOMContentLoaded", () => {
  renderRegistration();

  document.getElementById("resetProgress").addEventListener("click", () => {
    const confirmMsg = currentLang === "ar"
      ? "هل تريد فعلاً إعادة تصفير كل التقدم المحفوظ في هذا المتصفح؟"
      : "Are you sure you want to reset all saved progress in this browser?";
    if (confirm(confirmMsg)) {
      localStorage.removeItem(STORAGE_KEY);
      renderRegistration();
    }
  });
});

document.addEventListener("langChanged", renderRegistration);
