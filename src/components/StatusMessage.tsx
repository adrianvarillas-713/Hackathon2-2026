type StatusMessageProps = {
  title: string
  text: string
}

export function StatusMessage({ title, text }: StatusMessageProps) {
  return (
    <section className="rounded-md border border-stone-200 bg-white p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-stone-600">{text}</p>
    </section>
  )
}
