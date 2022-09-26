# My own markdown to HTML conversion module
import re

def main():
    ...

def paragraphs (markdown):
    return re.sub ("(\n)", "<br />", markdown)

def heading (markdown):
    return re.sub ("#(.+)", r"<h1>\1</h1>", markdown)



def internal_link (markdown):

    return re.sub ("\[(.+)\]\((.+)\)", r"<a href='\2'>\1</a>", markdown)


def external_link (markdown):

    return re.sub ("\[(.+)\]\((https?:\/\/.+)\)", r"<a href='\2'>\1</a>", markdown)


def boldface_text (markdown):
    return re.sub ("\*\*(.+)\*\*", r"<b>\1</b>", markdown)


if __name__ == "__main__":
    main ()




