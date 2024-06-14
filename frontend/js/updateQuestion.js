async function onUpdate(button)
{
    try {
        const response = await fetch('/admin/updateQuizUrl', {method: 'POST'});
        const data = await response.json();
        if(data.success)
        {

            window.location.href = data.redirectUrl + `?id=${button.id}`;
        }
        else
        {
            window.location.href = '/forbidden';
        }

    } catch (error) {
        console.error('Error fetching quizzes:', error);
    }
}