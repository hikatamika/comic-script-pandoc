local ignore = {Description = true, Action = true, Notes = true}

local function textify(x) return pandoc.utils.stringify(x):gsub("%s+$", "") end

function Writer(doc, opts)

  local rows = {}

  local function addrow(id, speaker, text)
    table.insert(rows, table.concat({id or "", speaker or "", text or ""}, "\t"))
  end

  local page = 0
  local line = 0

  local function processLine(l)

    l = l:gsub("^%s+", ""):gsub("%s+$", "")

    if l == "" then return end

    if l:match("^Page") or l == "P" then
      page = page + 1
        addrow("", "", "")
        addrow("Page " .. tostring(page), "", "")
      line = 0
      return
    end

    local speaker, dialogue = l:match("^([^:]+):%s*(.*)$")

    if speaker and not ignore[speaker] then
      line = line + 1
      addrow(page .. "." .. line, speaker, dialogue)
    end
  end

  for _, block in ipairs(doc.blocks) do
    if block.t == "Para" or block.t == "Plain" then
      local current = ""
      for _, inline in ipairs(block.content) do
        if inline.t == "SoftBreak" or inline.t == "LineBreak" then
          processLine(current)
          current = ""
        elseif inline.t == "Space" then
          current = current .. " "
        else
          current = current .. textify(inline)
        end
      end
      processLine(current)
    end
  end

  return table.concat(rows, "\n")

end