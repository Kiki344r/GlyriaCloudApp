export default defineAppConfig({
  ui: {
    colors: {
      primary: 'indigo',
      secondary: 'purple',
      success: 'teal',
      info: 'blue',
      warning: 'amber',
      error: 'red',
      neutral: 'slate',
      accent: 'pink'
    },
    toast: {
      slots: {
        root: 'bg-dark ring-2 ring-gray-400/20',
        title: 'text-white',
        description: 'text-gray-400'
      }
    },
    authForm: {
      slots: {
        title: 'text-white',
        description: 'text-gray-400'
      }
    },
    navigationMenu: {
      slots: {
        link: 'hover:cursor-pointer',
        linkLabel: 'text-gray-400 hover:text-white transition-colors w-full text-start'
      }
    }
  }
})
