# build.sh
echo "Starting build script"

pip install -r requirements.txt

# make migrations
python3 manage.py makemigrations
python3 manage.py migrate

# collectstatic
python3 manage.py collectstatic --no-input   

echo "Build script completed"