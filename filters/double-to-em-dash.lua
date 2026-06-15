-- Replace double dashes with em-dashes (which get use in some manga style guides) without using the "smart" extension, which also targets ellipses (…) and curly quotes 
function Str(el)
    -- If Smart isn't loaded, turn raw -- into em-dash.
    el.text = el.text:gsub("--", "—")
    -- If smart *is* loaded, turn the resulting en-dash into an em-dash.
    el.text = el.text:gsub("–", "—")
    return el
end