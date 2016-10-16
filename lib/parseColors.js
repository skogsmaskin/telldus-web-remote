function extractparams(str) {
  const inner = str.match(/.*\((.+)\)/)[1]
  return inner.split(/\s*,\s*/).map(Number)
}

export default function parse(schemetxt) {
  return schemetxt.split('\n')
    .map(line => line.trim())
    .filter(line => !line.startsWith('#'))
    .filter(Boolean)
    .reduce((groups, line) => {
      if (line.startsWith('***')) {
        return groups.concat({header: line, colors: []})
      }
      const currentGroup = groups[groups.length - 1]
      if (!currentGroup) {
        throw new Error('Parse error: expected *** as group delimiter')
      }
      const [name, hex, rgb] = line.split(' = ')
      currentGroup.colors.push({name, hex, rgb: extractparams(rgb)})
      return groups
    }, [])
}
