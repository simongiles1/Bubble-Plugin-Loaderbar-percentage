function(instance, properties, context) {
    instance.data.progress_completed = properties.progress_completed;


    function show_progress(progress_percent, current_time) {
        if (properties.log_to_console) {
        	console.log('Progress %: ' + progress_percent);
        }
        instance.publishState('pass_through_text', properties.pass_through_text);
        instance.publishState('pass_through_object', properties.pass_through_object);
        instance.publishState('progress_percentage', progress_percent);
        instance.publishState('elapsed_time', current_time);
        
        instance.data.loader_id = properties.loader_bar_id;
        let loader = document.getElementById(properties.loader_bar_id);
        let loaderParent = loader.parentElement;
        if (properties.overflow_hidden) {
            loaderParent.style.overflow = 'hidden';
        }
        
        loader.style.maxWidth = progress_percent + '%';
        loader.style.width = progress_percent + '%';
        if (loader.getBoundingClientRect().width >= loader.parentElement.getBoundingClientRect().width - 5 && properties.unround_bottom_right) {
            loader.style.borderBottomRightRadius = '0px';
        }
    }

    function resetState() {
        clearInterval(instance.data.__interval);
        instance.data.x = 0;
        instance.data.t_t = 0;
        instance.data.first_time = true;
    }


    function loaderFunc() {
        /*
        let t_max = 100;
        let t_t = instance.data.x;

        return () => {
            let x_95 = properties.x_95;
            let r = properties.r_factor;
            let k = -Math.log(1-0.95)/x_95;
            let a = (100 - r * k * Math.exp(-k * t_t) * t_max - r * (1 - Math.exp(-k * t_t)) + r * k * Math.exp(-k * t_t) * t_t) / (Math.pow(t_max, 2) - 2 * t_t * t_max + Math.pow(t_t, 2));
            let b = r * k * Math.exp(-k * t_t) - 2 * a * t_t;
            let c = r * (1 - Math.exp(-k * t_t)) - (r * k * Math.exp(-k * t_t) - 2 * a * t_t) * t_t - a * Math.pow(t_t, 2);
            let f_1 = r * (1 - Math.exp(-k * instance.data.x));
            let f_2 = a * Math.pow(instance.data.x, 2) + b * instance.data.x + c;

            if (!instance.data.progress_completed) {
                show_progress(f_1, instance.data.x);
                t_t = instance.data.x;
                t_max = t_t + properties.additional_time;
            }
            else {
                if (instance.data.first_time) {
                    t_max = t_t + properties.additional_time;
                    instance.data.first_time = false;
                }
                show_progress(f_2, instance.data.x);
            }

            instance.data.x += properties.increment / 1000;
            if (properties.log_to_console) {
            	console.log("x: " + instance.data.x.toFixed(2) + " t_max: " + t_max.toFixed(2));
            }

            if (parseFloat(instance.data.x.toFixed(2)) > parseFloat(t_max.toFixed(2))) {
                resetState();
                instance.triggerEvent('loading_complete');
            }

        }
    }
    */
        let t_max = 100;
        let t_t = instance.data.x;

        return () => {
            let x_95 = properties.x_95;
            let r = properties.r_factor;
            let k = -Math.log(1-0.95)/x_95;
            let a = (100 - r * k * Math.exp(-k * t_t) * t_max - r * (1 - Math.exp(-k * t_t)) + r * k * Math.exp(-k * t_t) * t_t) / (Math.pow(t_max, 2) - 2 * t_t * t_max + Math.pow(t_t, 2));
            let b = r * k * Math.exp(-k * t_t) - 2 * a * t_t;
            let c = r * (1 - Math.exp(-k * t_t)) - (r * k * Math.exp(-k * t_t) - 2 * a * t_t) * t_t - a * Math.pow(t_t, 2);
            let f_1 = r * (1 - Math.exp(-k * instance.data.x));
            let f_2 = a * Math.pow(instance.data.x, 2) + b * instance.data.x + c;

            // Determine whether to use f_1 or f_2 based on the presence/value of properties.complete_after_x
            let useF2 = (typeof properties.complete_after_x !== 'undefined' && properties.complete_after_x !== null) && (instance.data.x >= properties.complete_after_x);

            if (!useF2) {
                show_progress(f_1, instance.data.x);
                t_t = instance.data.x;
                t_max = t_t + properties.additional_time;
            } else {
                if (instance.data.first_time) {
                    t_max = t_t + properties.additional_time;
                    instance.data.first_time = false;
                }
                show_progress(f_2, instance.data.x);
            }

            instance.data.x += properties.increment / 1000;
            if (properties.log_to_console) {
                console.log("x: " + instance.data.x.toFixed(2) + " t_max: " + t_max.toFixed(2) + " useF2: " + useF2);
            }

            if (parseFloat(instance.data.x.toFixed(2)) > parseFloat(t_max.toFixed(2))) {
                resetState();
                instance.triggerEvent('loading_complete');
            }

        }
    }
    if (properties.run && !instance.data.__interval) {
        instance.data.__interval = setInterval(loaderFunc(), properties.increment);
    } else if (!properties.run) {
        resetState();
    }
}