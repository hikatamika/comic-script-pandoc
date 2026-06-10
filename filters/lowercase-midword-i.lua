--[[ When a word has an uppercase I in the middle of it, convert to lowercase, so that the barred-pronoun-I does not get triggered in all-caps comic fonts in non-pronoun use. 
]]
function Str(el)
  el.text = el.text:gsub("(%a)I(%a)", "%1i%2")
  return el
end