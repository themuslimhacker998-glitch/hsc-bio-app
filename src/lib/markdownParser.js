function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function parseInline(text) {
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>')
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>')
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  return text
}

function parseRow(line) {
  return line
    .replace(/^\||\|$/g, '')
    .split('|')
    .map(function (c) { return c.trim() })
}

function parseMarkdown(markdown) {
  if (!markdown) return ''
  var lines = markdown.split('\n')
  var out = []
  var i = 0

  while (i < lines.length) {
    var line = lines[i]

    if (/^```/.test(line)) {
      var lang = line.slice(3).trim()
      var code = []
      i++
      while (i < lines.length && !/^```/.test(lines[i])) {
        code.push(escapeHtml(lines[i]))
        i++
      }
      i++
      out.push(
        '<pre' + (lang ? ' class="language-' + lang + '"' : '') + '><code>' +
        code.join('\n') + '</code></pre>'
      )
      continue
    }

    if (/^#{1,6}\s/.test(line)) {
      var m = line.match(/^(#{1,6})\s+(.*)/)
      var level = m[1].length
      out.push('<h' + level + '>' + parseInline(m[2]) + '</h' + level + '>')
      i++
      continue
    }

    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      out.push('<hr />')
      i++
      continue
    }

    if (/^\|/.test(line) && i + 1 < lines.length && /^\|[\s\-:|]+\|$/.test(lines[i + 1])) {
      var headers = parseRow(line)
      var aligns = parseRow(lines[i + 1]).map(function (cell) {
        if (/^:-+:$/.test(cell)) return 'center'
        if (/^-+:$/.test(cell)) return 'right'
        return 'left'
      })
      i += 2
      var tableHtml = '<table><thead><tr>'
      headers.forEach(function (h, idx) {
        var a = aligns[idx] || 'left'
        tableHtml += '<th style="text-align:' + a + '">' + parseInline(h) + '</th>'
      })
      tableHtml += '</tr></thead><tbody>'
      while (i < lines.length && /^\|/.test(lines[i])) {
        var cells = parseRow(lines[i])
        tableHtml += '<tr>'
        cells.forEach(function (c, idx) {
          var a = aligns[idx] || 'left'
          tableHtml += '<td style="text-align:' + a + '">' + parseInline(c) + '</td>'
        })
        tableHtml += '</tr>'
        i++
      }
      tableHtml += '</tbody></table>'
      out.push(tableHtml)
      continue
    }

    if (/^>\s/.test(line)) {
      var bq = []
      while (i < lines.length && /^>\s/.test(lines[i])) {
        bq.push(lines[i].replace(/^>\s/, ''))
        i++
      }
      out.push('<blockquote>' + parseInline(bq.join(' ')) + '</blockquote>')
      continue
    }

    if (/^\d+\.\s/.test(line)) {
      var items = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push('<li>' + parseInline(lines[i].replace(/^\d+\.\s+/, '')) + '</li>')
        i++
      }
      out.push('<ol>' + items.join('') + '</ol>')
      continue
    }

    if (/^[-*+]\s/.test(line)) {
      var uitems = []
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        uitems.push('<li>' + parseInline(lines[i].replace(/^[-*+]\s+/, '')) + '</li>')
        i++
      }
      out.push('<ul>' + uitems.join('') + '</ul>')
      continue
    }

    if (line.trim() === '') {
      i++
      continue
    }

    var para = []
    while (i < lines.length && lines[i].trim() !== '' && !/^(#{1,6}\s|```|>\s|\d+\.\s|[-*+]\s|\||-[\s-]*$|\*[\s*]*$|_[\s_]*$)/.test(lines[i])) {
      para.push(lines[i])
      i++
    }
    if (para.length) {
      out.push('<p>' + parseInline(para.join(' ')) + '</p>')
    }
  }

  return out.join('\n')
}

export default parseMarkdown
