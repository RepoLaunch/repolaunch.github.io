# The layout should be same for each sub page.

## Theme color
Light Yellow, Light Brown, Light Green

## Webpage Layout
### top bar
on the left: (./assets/github) GitHub Repo

on the right: (./assets/logo.png) RepoLaunch Agent

### left side bar
Always show at laptop mode (width>length)
Hide to left with a button to click to pop up at phone mode (length>width)
```
|_Introduction -- index.html
|_Installation -- pages/installation/installation.html
    |_Windows Container Setup -- pages/installation/windows.html
|_Run RepoLaunch -- pages/run/run.html
    |_Useful public APIs -- pages/run/api.html
|_Citations & History -- pages/citations.html
|_Contact Us -- pages/contact.html
```

### bottom bar
Be two columns at laptop mode (width>length)
Shrink to one column at phone mode (length>width)
```
Relevant Links:
# column 1
[SWE-bench-Live Webpage](https://swe-bench-live.github.io/)
[SWE-bench-Live GitHub](https://github.com/microsoft/SWE-bench-Live)
# column 2
[SWE-bench-Live Huggingface](https://huggingface.co/collections/SWE-bench-Live/swe-bench-live)
[Cross-platform Bench Huggingface](https://huggingface.co/collections/SWE-bench-Live/cross-platform-bench)
```
