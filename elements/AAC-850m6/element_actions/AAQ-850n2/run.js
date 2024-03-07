function(instance, properties, context) {

	instance.data.x = 0;
    instance.data.first_time = true;
    instance.data.t_t = 0;
    instance.data.test = 'test value';
    instance.data.__interval = false;
    instance.publishState('elapsed_time', 0);
    instance.publishState('progress_percentage', 0);
    document.getElementById(instance.data.loader_id).style.width = '0%';


}