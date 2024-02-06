# Code to test riffusion. Not used in my final demo.

import os  # Import the os module to access environment variables
import replicate

# Set the API token as an environment variable
os.environ['REPLICATE_API_TOKEN'] = "xxx"

# Now, run the model using the API token
# output = replicate.run(
#     "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
#     input={"prompt_a": "funky synth solo"}
# )

output = replicate.run(
    "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
    input={"prompt_a": "hip hop",
           "prompt_b": "rap music",
           "denoising": 0.75,
           "alpha": 0.5}
)
print(output)
