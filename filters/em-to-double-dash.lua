-- Replace em-dashes with double dashes (which some publishers/cartoonists prefer) without using the "smart" extension, which also targets ellipses (…) and curly quotes 
function Str(el)
    el.text = el.text:gsub("—", "--")
    return el
end