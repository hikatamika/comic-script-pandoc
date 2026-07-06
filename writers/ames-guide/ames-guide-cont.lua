-- GUI Version

--[[
  opts.variables = {
    pageHeadingLvl = 1,
    srcHeadingLvl = 3,
    blankPageSeparators = false,
    labeledPageSeparators = false,
    removeDuplicateLines = false
  }
]]

  -- Shorthand for Pandoc's stringify utility, with the bonus of getting rid of the rare (currently) inexplicable Pandoc ending spaces.
local function textify(x)
  return (pandoc.utils.stringify(x):gsub("%s+$", ""))
end

function Writer(doc, opts)

  -- This is the LUA table that collects stuff for your comic lettering table as it reads your script.
  local rows = {}

  -- Here's the function that adds stuff to your comic lettering table row by row. The if/then stuff further down sends stuff to this.
  local function addrow(a, b, c)
    -- a is column 1 w/ the IDs, b is column 2 w/ the lettering source, and c is column 3 w/ the lettering line.
    table.insert(rows, table.concat({a or "", b or "", c or ""}, "\t"))
  end

  local page = 0
  local prevNum = nil
  local speaker = ""
  local line = 0

  -- The main function!!
  for _, block in ipairs(doc.blocks) do

    -- If we come across a header
    if block.t == "Header" then

      -- That's a Comic Script Page Element
      -- ⚙️ Select the heading level that represents pages in your doc. For me it's heading 1.
      if block.level == 1 then
        -- Update page ID.
        local raw = textify(block.content)

        local function isContinuation(text)
        text = text:lower()

          -- All the continue variants I could think of.
          return text:find("%(cont%.?%)")
              or text:find("%(cont'%w+%)")
              or text:find("cont%.'?d")
              or text:find("continued")
              or text:find("con'%w+%s*$")
        end

        -- Normalize (lowercase) heading into something comparable
        local function normalize(text)
          text = text:lower()

          -- remove continuation markers so they compare equal
          text = text:gsub("%(cont%.?%)", "")
          text = text:gsub("%(cont'%w+%)", "")
          text = text:gsub("cont%.'?d", "")
          text = text:gsub("continued", "")
          text = text:gsub("con'%w+%s*$", "")

          -- collapse whitespace
          text = text:gsub("%s+", " ")
          text = text:match("^%s*(.-)%s*$")

          return text
        end

        local cont = isContinuation(raw)
        local sig = normalize(raw)

        if not prevSig then
          page = 1
        else
          -- Only increment if headings are different AND it's not a continuation
          if (not cont) and sig ~= prevSig then
            page = page + 1
          end
        end

        prevSig = sig

        -- and reset line number.
        line = 0

        -- Optional per-page line separators.
        -- ⚙️ Comment off/on to toggle if you do/don't want blank page separators.
        addrow("", "", "")
        -- ⚙️ Comment off/on to toggle if you do/don't want labeled page separators.
        addrow("Page " .. tostring(page), "", "")

        -- If we come across a header that's a Comic Script Speaker/Caption/SFX Element
        -- ⚙️ Select the heading level that represents lettering element SOURCES (Speakers, SFX, Captions), not the lettering lines themselves. For me, this is heading level 3, skipping over 2, which represents panels.
      elseif block.level == 3 then
        -- We're basically just yoinking the text inside to shove into column 2 w/ this speaker variable.
        speaker = textify(block.content)
      end

    -- Onto ordered lists as Dialog line lettering elements.
    elseif block.t == "OrderedList" then

      -- for every numbered dialog line
      for _, item in ipairs(block.content) do

        -- Bump up the line ID number in the table.
        line = line + 1

        -- Print to a row!
        addrow(
        -- We put the page number from the last page we crossed, a ., and then the line number.
        tostring(page) .. "." .. tostring(line),
        -- Then the name of the lettering element source.
        speaker,
        -- Finally we convert the line to plain text and shove it in.
        textify(item))
      end

    -- PanDoc interprets my tabbed in SFX and Caption lines as block quotes! Unnumbered dialog can also be interpreted as block quotes by Pandoc.
    elseif block.t == "BlockQuote" then
      local blocks = block.content

      -- For each line block in the BlockQuote
      for i = 1, #blocks do

        -- Increase the line number
        line = line + 1

        -- Make col1 the page.line number ID thing,
        -- col2 the lettering item source,
        -- and col 3 the line itself.
        addrow(tostring(page) .. "." .. tostring(line), speaker, textify(blocks[i]))
      end

      -- Sometimes, SFX and Captions are read as paragraphs
      elseif block.t == "Para" then
        -- Increase the line number
        line = line + 1
  
        -- Make col1 the page.line number ID thing,
        -- col2 the lettering item source,
        -- and col3 the paragraph text.
        addrow(tostring(page) .. "." .. tostring(line), speaker, textify(block))
    end
  end

  -- Sometimes, especially for WIP scripts, unfilled pages, become empty lines. This makes sure there's no double-empty lines.
  -- Here's where the cleaned table will go.
  local tidy_rows = {}
  -- We'll use this to compare the current row to the prev row.
  local prev = nil

  for _, rows_item in ipairs(rows) do
    if rows_item ~= prev then
      table.insert(tidy_rows, rows_item)
      prev = rows_item
    end
  end

  --[[ ⚙️ Send out the final table.
    Use tidy_rows to remove duplicates, or rows if you might have characters that may say the same thing twice in a row.]]
  return table.concat(tidy_rows, "\n")
end
