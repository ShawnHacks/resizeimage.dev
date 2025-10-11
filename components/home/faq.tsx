import { useTranslations } from 'next-intl'

interface FAQItem {
  question: string
  answer: string
}

function FAQItem({ question, answer }: FAQItem) {
  return (
    <details className="group border rounded-lg bg-card">
      <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-left hover:bg-muted/50 transition-colors list-none">
        <h3 className="text-lg font-medium pr-4">{question}</h3>
        <svg
          className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      <div className="px-6 pb-4">
        <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
          {answer}
        </div>
      </div>
    </details>
  )
}

export function FAQ() {
  const t = useTranslations('FAQ')

  const faqs: FAQItem[] = [
    {
      question: t('howToUse.question'),
      answer: t('howToUse.answer')
    },
    {
      question: t('formats.question'),
      answer: t('formats.answer')
    },
    {
      question: t('storage.question'),
      answer: t('storage.answer')
    },
    {
      question: t('privacy.question'),
      answer: t('privacy.answer')
    },
    {
      question: t('limitations.question'),
      answer: t('limitations.answer')
    },
    {
      question: t('popups.question'),
      answer: t('popups.answer')
    },
    {
      question: t('slow.question'),
      answer: t('slow.answer')
    },
    {
      question: t('accuracy.question'),
      answer: t('accuracy.answer')
    }
  ]

  return (
    <section id="faq" className="py-20 bg-muted/30" aria-labelledby="faq-heading">
      <div className="container mx-auto px-4">
        <header className="text-center mb-12">
          <h2 id="faq-heading" className="text-3xl font-bricolage font-semibold mb-4 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
            {t('title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </header>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
