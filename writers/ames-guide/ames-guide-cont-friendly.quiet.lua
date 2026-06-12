local function textify(x)
  return (pandoc.utils.stringify(x):gsub("%s+$", ""))
end

function Writer(doc, opts)

  local rows = {}

  local function addrow(a, b, c)
    table.insert(rows, table.concat({a or "", b or "", c or ""}, "\t"))
  end

  local page = 0
  local prevNum = nil
  local speaker = ""
  local line = 0

  for _, block in ipairs(doc.blocks) do

    if block.t == "Header" then

      if block.level == 1 then
        local raw = textify(block.content)

        local function isContinuation(text)
        text = text:lower()

          return text:find("%(cont%.?%)")
              or text:find("%(cont'%w+%)")
              or text:find("cont%.'?d")
              or text:find("continued")
              or text:find("con'%w+%s*$")
        end

        local function normalize(text)
          text = text:lower()

          text = text:gsub("%(cont%.?%)", "")
          text = text:gsub("%(cont'%w+%)", "")
          text = text:gsub("cont%.'?d", "")
          text = text:gsub("continued", "")
          text = text:gsub("con'%w+%s*$", "")

          text = text:gsub("%s+", " ")
          text = text:match("^%s*(.-)%s*$")

          return text
        end

        local cont = isContinuation(raw)
        local sig = normalize(raw)

        if not prevSig then
          page = 1
        else
          if (not cont) and sig ~= prevSig then
            page = page + 1
          end
        end

        prevSig = sig

        line = 0

        addrow("", "", "")

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