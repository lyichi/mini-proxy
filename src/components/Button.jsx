export const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-2 py-1 text-xs bg-zinc-300 rounded select-none hover:bg-zinc-200 active:translate-y-px transition ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
