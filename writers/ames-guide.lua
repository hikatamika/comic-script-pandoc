--[[ Ames Guide v1.0.0 © HK★TMK - 2026
  Licensed under GNU AGPLv3

  Options are marked with ⚙️ so you can Ctrl-F them better.]]

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

  --[[ ⚙️ Named Pages ↓
  (If you'd rather have page ID based on the page header's written name, uncomment the line below here and re-comment the line below Auto Pages.)]]
  -- local page = ""
  -- ⚙️ Auto Pages ↓
  local page = 0
  local speaker = ""
  local line = 0

  -- The main function!!
  for _, block in ipairs(doc.blocks) do

    -- If we come across a header
    if block.t == "Header" then

      -- That's a Comic Script Page Element
      -- ⚙️ Select the heading level that represents pages in your doc. For me it's heading 1.
      if block.level == 1 then
        -- Update page ID. Comes in Named Pages and Auto Pages
        --[[ ⚙️ Named Pages ↓
  (If you'd rather have page ID based on the page header's written name, uncomment the line below here and re-comment the line below Auto Pages.)]]
        -- page = textify(block.content)
        -- ⚙️ Auto Pages ↓
        page = page + 1
        -- and reset line number.
        line = 0

        -- Optional per-page line separator.
        -- ⚙️ Comment off/on to toggle if you do/don't want blank rows as page separators.
        addrow("", "", "")

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
        page .. "." .. tostring(line),
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

        -- Make col1 the page.line number ID thing, col2 the lettering item source, and col 3 the line itself.
        addrow(page .. "." .. tostring(line), speaker, textify(blocks[i]))
      end
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
