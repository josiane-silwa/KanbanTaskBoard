# build.sh
echo "Starting build script"

set -o errexit

pip install -r requirements.txt

# collectstatic
python3 manage.py collectstatic --no-input   

# make migrations
python3 manage.py makemigrations
python3 manage.py migrate

if [[ $CREATE_SUPERUSER ]]
then
    python manage.py createsuperuser --no-input
fi

echo "Build script completed"