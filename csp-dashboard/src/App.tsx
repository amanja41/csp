import { type Plugin } from 'csp-plugin'
import { useEffect, useState } from 'react'

function getAllRemotes(): Promise<Array<{ default: Plugin }>> {
  return Promise.all([
    import('csp-ciam-plugins/customer-search'),
    import('csp-ciam-plugins/customer-timeline'),
  ])
}

export function App() {
  const [plugins, setPlugins] = useState<Plugin[] | null>(null)

  useEffect(() => {
    getAllRemotes()
      .then(mods => mods.map(mod => mod.default))
      .then(remotes => {
        setPlugins(remotes)
      })
  }, [])

  const routesArray = plugins?.map(p => p.routes) ?? []
  const routes = Object.assign({}, ...routesArray)

  console.log(routes)

  return (
    <div className="App">
      <h1>CSP Dashboard</h1>
      {Object.entries(routes).map(([name, Component]) => (
        <div
          key={name}
          style={{ border: '1px solid black', margin: '10px', padding: '10px' }}
        >
          <h2>{name}</h2>
          {Component ? <Component /> : null}
        </div>
      ))}
      {!plugins && <div>Loading...</div>}
    </div>
  )
}
