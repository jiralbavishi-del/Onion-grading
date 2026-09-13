import os
import re

file_path = "src/components/OnionAssessmentForm/translations.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

content = re.sub(r",\s*,", ",", content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Double commas removed successfully!")
