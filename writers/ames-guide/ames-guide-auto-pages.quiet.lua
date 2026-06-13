local function textify(x)
  return (pandoc.utils.stringify(x):gsub("%s+$", ""))
end

function Writer(doc, opts)

  local rows = {}

  local function addrow(a, b, c)
    table.insert(rows, table.concat({a or "", b or "", c or ""}, "\t"))
  end

  local page = 0
  local speaker = ""
  local line = 0

  for _, block in ipairs(doc.blocks) do

    if block.t == "Header" then

      if block.level == 1 then

        page = page + 1
        line = 0

        addrow("", "", "")
        addrow("Page " .. tostring(page), "", "")

      elseif block.level == 3 then
        speaker = textify(block.content)
      end

    elseif block.t == "OrderedList" then

      for _, item in ipairs(block.content) do

        line = line + 1

        addrow(
        page .. "." .. tostring(line),
        speaker,
        textify(item))
      end

    elseif block.t == "BlockQuote" then
      local blocks = block.content

      for i = 1, #blocks do

        line = line + 1

        addrow(page .. "." .. tostring(line), speaker, textify(blocks[i]))
      end

      elseif block.t == "Para" then
        line = line + 1
  
        addrow(page .. "." .. tostring(line), speaker, textify(block))
    end
  end

  local tidy_rows = {}
  local prev = nil

  for _, rows_item in ipairs(rows) do
    if rows_item ~= prev then
      table.insert(tidy_rows, rows_item)
      prev = rows_item
    end
  end

    return table.concat(tidy_rows, "\n")
end