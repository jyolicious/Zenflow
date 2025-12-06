import React from 'react'

export default function Footer(){
  return (
    <footer className="bg-gray-50 border-t mt-8">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm">
        <div>© {new Date().getFullYear()} ZenFlow — contact: <a href="mailto:hello@zenflow.app" className="underline">hello@zenflow.app</a></div>
        <div className="mt-3 md:mt-0">Built with ❤️ — demo</div>
      </div>
    </footer>
  )
}
