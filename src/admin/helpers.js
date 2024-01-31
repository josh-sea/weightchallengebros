const formatDate = (timestamp) => {
    const date = new Date(parseInt(timestamp));

    if (isNaN(date.getTime())) {
        console.error("Invalid Date created from timestamp:", timestamp);
        return 'Invalid Date';
    }

    const options = {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    };

    return date.toLocaleString('en-US', options).replace(',', '').replace(' PM','PM').replace(' AM','AM');
};

export { formatDate };