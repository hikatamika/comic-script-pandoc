--[[ When a word starts with an uppercase "I" but is immediately followed by lowercase alphabet character,
convert to a lowercase "i". This converts "I" to lowercase when at the start of a non-pronoun word. Useful for dodging the barred "I" character within non-pronoun "I" use when using all-uppercase comic fonts.]]
function Str(el)
    el.text = el.text:gsub("^I([a-z].*)$", "i%1")
    return el
end