--[[ Moon Crystal Pandoc Lua Writer
  https://github.com/hikatamika/comic-script-pandoc
  Licensed under GNU AGPLv3

  Options are marked with ⚙️ so you can Ctrl-F them better.]] -- Shorthand for Pandoc's stringify utility, with the bonus of getting rid of the rare (currently) inexplicable Pandoc ending spaces.
--[[ Moon Crystal Pandoc Lua Writer
  Converts comic scripts to a TSV lettering table.
]] --
--------------------------------------------------
-- ⚙️ Speakers to ignore
--------------------------------------------------
local ignore = {Description = true, Action = true, Notes = true}

local function textify(x) return pandoc.utils.stringify(x):gsub("%s+$", "") end

function Writer(doc, opts)

  -- This is the LUA table that collects stuff for your comic lettering table as it reads your script.
  local rows = {}

  -- Here's the function that adds stuff to your comic lettering table row by row. The if/then stuff further down sends stuff to this.
  local function addrow(id, speaker, text)
    table.insert(rows, table.concat({id or "", speaker or "", text or ""}, "\t"))
  end

  local page = 0
  local line = 0

  -- Go line by line, cause it's Markdown.
  local function processLine(l)

    l = l:gsub("^%s+", ""):gsub("%s+$", "")

    if l == "" then return end

    -- Leave out Page markers
    if l:match("^Page") or l == "P" then
      page = page + 1
        -- Optional per-page line separators.
        -- ⚙️ Comment off/on to toggle if you do/don't want blank page separators.
        addrow("", "", "")
        -- ⚙️ Comment off/on to toggle if you do/don't want labeled page separators.
        addrow("Page " .. tostring(page), "", "")
      line = 0
      return
    end

    -- Get speaker markers before colon, and text markers after.
    local speaker, dialogue = l:match("^([^:]+):%s*(.*)$")

    -- Keep if not from the ignore array.
    if speaker and not ignore[speaker] then
      line = line + 1
      addrow(page .. "." .. line, speaker, dialogue)
    end
  end

  -- The main function!! Walk the Pandoc AST
  for _, block in ipairs(doc.blocks) do
    -- Only get paragraph blocks and plain text blocks
    if block.t == "Para" or block.t == "Plain" then
      -- Where we'll store the current line as we put it back together.
      local current = ""
      -- For every inline element
      for _, inline in ipairs(block.content) do
        -- Both soft breaks and line breaks (AST-wise, not Markdown wise). So if we find one,
        if inline.t == "SoftBreak" or inline.t == "LineBreak" then
          -- send the complete line to the current variable
          processLine(current)
          current = ""
        -- Otherwise keep going, and for every AST space
        elseif inline.t == "Space" then
          -- Add a plaintext one to our storage
          current = current .. " "
        -- Otherwise, take each character to the storage as is
        else
          current = current .. textify(inline)
        end
      end
      -- And cause the last line of a paragraph won't end with a line break, yoink it in too.
      processLine(current)
    end
  end

  return table.concat(rows, "\n")

end
